import { Request, Response, NextFunction } from 'express';
import prisma from '../database/client';
import StorageService from '../services/storage.service';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

const getFileCategory = (mime: string, name: string): string => {
  const m = mime ? mime.toLowerCase() : '';
  if (m.startsWith('image/')) return 'image';
  if (m.startsWith('video/')) return 'video';
  if (m.startsWith('audio/')) return 'audio';
  
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx', 'csv'].includes(ext)) return 'document';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'm4a', 'ogg'].includes(ext)) return 'audio';
  return 'other';
};

export const uploadEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError('No file was uploaded');
    }
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const folder = `users/${req.user.uid}/evidence`;
    const timestamp = Date.now();
    const safeName = originalname.replace(/[^a-zA-Z0-9._\-]/g, '_');
    const storagePath = `${timestamp}_${safeName}`;

    // Upload to Cloudinary
    const uploadResult = await StorageService.uploadBuffer(buffer, folder, storagePath);

    const category = getFileCategory(mimetype, originalname);

    // Create database entry
    const evidence = await prisma.evidence.create({
      data: {
        userId: req.user.uid,
        fileName: originalname,
        mimeType: mimetype || 'application/octet-stream',
        fileSize: size,
        storageUrl: uploadResult.url,
        storagePath: uploadResult.publicId,
        category
      }
    });

    res.status(201).json({
      status: 'success',
      evidence: {
        id: evidence.id,
        fileName: evidence.fileName,
        fileSize: evidence.fileSize,
        category: evidence.category,
        downloadUrl: evidence.storageUrl,
        uploadedAt: evidence.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getEvidenceList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const list = await prisma.evidence.findMany({
      where: { userId: req.user.uid },
      orderBy: { createdAt: 'desc' }
    });

    const formattedList = list.map(f => ({
      id: f.id,
      fileName: f.fileName,
      fileSize: f.fileSize,
      category: f.category,
      downloadUrl: f.storageUrl,
      uploadedAt: f.createdAt
    }));

    res.status(200).json({
      status: 'success',
      files: formattedList
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const evidence = await prisma.evidence.findFirst({
      where: { id, userId: req.user.uid }
    });

    if (!evidence) {
      throw new NotFoundError('Evidence record not found');
    }

    // Delete from Cloudinary
    await StorageService.deleteFile(evidence.storagePath);

    // Delete from Database
    await prisma.evidence.delete({
      where: { id }
    });

    res.status(200).json({
      status: 'success',
      message: 'Evidence deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
