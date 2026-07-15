import { Router } from 'express';
import {
  saveNoticeDraft,
  getNoticeDraftsList,
  getNoticeDraftDetails,
  deleteNoticeDraft
} from '../controllers/notice.controller';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.use(authGuard);

router.post('/save', saveNoticeDraft);
router.get('/', getNoticeDraftsList);
router.get('/:id', getNoticeDraftDetails);
router.delete('/:id', deleteNoticeDraft);

export default router;
