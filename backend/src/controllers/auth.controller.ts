import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../database/client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/customErrors';
import EmailService from '../services/email.service';
import { Role } from '@prisma/client';

// Simple in-memory store for OTPs (10 min expiry)
const otpStore = new Map<string, { otp: string; expires: number }>();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create unverified user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: (role as Role) || Role.USER,
        isVerified: false
      }
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 mins
    otpStore.set(email, { otp, expires });

    await EmailService.sendOtp(email, otp);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. OTP sent to your email.'
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email);
    if (!record || record.expires < Date.now()) {
      throw new BadRequestError('OTP has expired or does not exist');
    }

    if (record.otp !== otp) {
      throw new BadRequestError('Invalid verification code');
    }

    otpStore.delete(email);

    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true }
    });

    const accessToken = generateAccessToken({ uid: user.id, role: user.role, email: user.email });
    const refreshToken = generateRefreshToken({ uid: user.id });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      status: 'success',
      accessToken,
      user: {
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isVerified) {
      // Re-send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000;
      otpStore.set(email, { otp, expires });
      await EmailService.sendOtp(email, otp);
      
      return res.status(200).json({
        status: 'pending',
        message: 'Account not verified. A new OTP has been sent to your email.'
      });
    }

    const accessToken = generateAccessToken({ uid: user.id, role: user.role, email: user.email });
    const refreshToken = generateRefreshToken({ uid: user.id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: 'success',
      accessToken,
      user: {
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      throw new UnauthorizedError('Refresh token is missing');
    }

    const { uid } = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      throw new UnauthorizedError('User session not found');
    }

    const accessToken = generateAccessToken({ uid: user.id, role: user.role, email: user.email });
    
    res.status(200).json({
      status: 'success',
      accessToken
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('refreshToken');
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundError('No account found with this email');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, { otp, expires });

    await EmailService.sendOtp(email, otp);

    res.status(200).json({
      status: 'success',
      message: 'OTP for password reset sent to email'
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = otpStore.get(email);
    if (!record || record.expires < Date.now()) {
      throw new BadRequestError('OTP has expired or does not exist');
    }

    if (record.otp !== otp) {
      throw new BadRequestError('Invalid OTP code');
    }

    otpStore.delete(email);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. Please login with your new password.'
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.uid },
      select: { id: true, email: true, name: true, role: true, createdAt: true, profileImage: true }
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.status(200).json({
      status: 'success',
      user: {
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    next(err);
  }
};
