import { Request, Response, NextFunction } from 'express';
import prisma from '../database/client';
import AIService from '../services/ai.service';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

export const chatAssistant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const { message, sessionId } = req.body;
    if (!message) {
      throw new BadRequestError('Message prompt is required');
    }

    let activeSessionId = sessionId;
    
    // Create new session if not provided
    if (!activeSessionId) {
      const sessionTitle = message.substring(0, 30) + (message.length > 30 ? '...' : '');
      const newSession = await prisma.chatSession.create({
        data: {
          userId: req.user.uid,
          title: sessionTitle
        }
      });
      activeSessionId = newSession.id;
    }

    // Load message history from database
    const historyDb = await prisma.message.findMany({
      where: { sessionId: activeSessionId },
      orderBy: { createdAt: 'asc' }
    });

    // Format history for Gemini SDK
    // Structure: { role: 'user' | 'model', parts: [{ text: string }] }[]
    const geminiHistory = historyDb.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Send to Gemini AI
    const aiResponseText = await AIService.chatAssistant(geminiHistory, message);

    // Save messages in Database
    await prisma.$transaction([
      prisma.message.create({
        data: {
          sessionId: activeSessionId,
          sender: 'user',
          text: message
        }
      }),
      prisma.message.create({
        data: {
          sessionId: activeSessionId,
          sender: 'ai',
          text: aiResponseText
        }
      })
    ]);

    res.status(200).json({
      status: 'success',
      sessionId: activeSessionId,
      reply: aiResponseText
    });
  } catch (err) {
    next(err);
  }
};

export const getChatSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user.uid },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      sessions
    });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: req.user.uid }
    });

    if (!session) {
      throw new NotFoundError('Chat session not found');
    }

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({
      status: 'success',
      session,
      messages: messages.map(m => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

export const deleteChatSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: req.user.uid }
    });

    if (!session) {
      throw new NotFoundError('Chat session not found');
    }

    await prisma.chatSession.delete({
      where: { id: sessionId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Chat session deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const draftNotice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, sName, sAddr, sCity, sState, rName, rAddr, rCity, rState, details } = req.body;

    if (!subject || !sName || !rName || !details) {
      throw new BadRequestError('Missing notice drafting fields');
    }

    const senderAddrFull = `${sAddr}, ${sCity}, ${sState}`;
    const recipientAddrFull = `${rAddr}, ${rCity}, ${rState}`;

    const docHtml = await AIService.generateNotice(
      subject,
      sName,
      senderAddrFull,
      rName,
      recipientAddrFull,
      details
    );

    res.status(200).json({
      status: 'success',
      docHtml
    });
  } catch (err) {
    next(err);
  }
};

export const summarizeDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    if (!text) {
      throw new BadRequestError('Text is required to summarize');
    }

    const summary = await AIService.summarizeLegalText(text);

    res.status(200).json({
      status: 'success',
      summary
    });
  } catch (err) {
    next(err);
  }
};

export const ocrDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError('Image file is required for OCR scanning');
    }

    const text = await AIService.ocrImage(req.file.buffer, req.file.mimetype);

    res.status(200).json({
      status: 'success',
      text
    });
  } catch (err) {
    next(err);
  }
};

export const translateText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
      throw new BadRequestError('Text and targetLang parameters are required');
    }

    const translatedText = await AIService.translate(text, targetLang);

    res.status(200).json({
      status: 'success',
      translatedText
    });
  } catch (err) {
    next(err);
  }
};
