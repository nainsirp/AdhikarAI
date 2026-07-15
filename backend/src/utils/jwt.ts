import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './customErrors';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'super_secret_access_key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key';

export interface TokenPayload {
  uid: string;
  role: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: { uid: string }): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): { uid: string } => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { uid: string };
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};
