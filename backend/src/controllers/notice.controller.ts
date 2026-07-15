import { Request, Response, NextFunction } from 'express';
import prisma from '../database/client';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

export const saveNoticeDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const {
      id, // optional: if passed, update existing
      subject,
      sName, sAddr, sCity, sState,
      rName, rAddr, rCity, rState,
      details,
      docHtml
    } = req.body;

    if (!subject || !sName || !rName || !details || !docHtml) {
      throw new BadRequestError('Required notice drafting parameters are missing');
    }

    let draft;
    if (id) {
      // Update
      const existing = await prisma.savedNotice.findFirst({
        where: { id, userId: req.user.uid }
      });
      if (!existing) {
        throw new NotFoundError('Draft not found to update');
      }

      draft = await prisma.savedNotice.update({
        where: { id },
        data: {
          subject,
          sName, sAddr, sCity, sState,
          rName, rAddr, rCity, rState,
          details,
          docHtml
        }
      });
    } else {
      // Create new
      draft = await prisma.savedNotice.create({
        data: {
          userId: req.user.uid,
          subject,
          sName, sAddr, sCity, sState,
          rName, rAddr, rCity, rState,
          details,
          docHtml
        }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Draft notice saved successfully',
      draft: {
        id: draft.id,
        subject: draft.subject,
        savedAt: draft.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getNoticeDraftsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const list = await prisma.savedNotice.findMany({
      where: { userId: req.user.uid },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        createdAt: true
      }
    });

    const formattedList = list.map(d => ({
      id: d.id,
      subject: d.subject,
      savedAt: d.createdAt
    }));

    res.status(200).json({
      status: 'success',
      drafts: formattedList
    });
  } catch (err) {
    next(err);
  }
};

export const getNoticeDraftDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const draft = await prisma.savedNotice.findFirst({
      where: { id, userId: req.user.uid }
    });

    if (!draft) {
      throw new NotFoundError('Draft not found');
    }

    res.status(200).json({
      status: 'success',
      draft
    });
  } catch (err) {
    next(err);
  }
};

export const deleteNoticeDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const draft = await prisma.savedNotice.findFirst({
      where: { id, userId: req.user.uid }
    });

    if (!draft) {
      throw new NotFoundError('Draft not found');
    }

    await prisma.savedNotice.delete({
      where: { id }
    });

    res.status(200).json({
      status: 'success',
      message: 'Draft deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
