import { Router } from 'express';
import { uploadEvidence, getEvidenceList, deleteEvidence } from '../controllers/evidence.controller';
import { authGuard } from '../middleware/authGuard';
import upload from '../middleware/upload';

const router = Router();

// Secure all routes in this router
router.use(authGuard);

router.post('/upload', upload.single('file'), uploadEvidence);
router.get('/', getEvidenceList);
router.delete('/:id', deleteEvidence);

export default router;
