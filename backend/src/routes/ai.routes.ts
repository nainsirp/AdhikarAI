import { Router } from 'express';
import {
  chatAssistant,
  getChatSessions,
  getChatHistory,
  deleteChatSession,
  draftNotice,
  summarizeDocument,
  ocrDocument,
  translateText
} from '../controllers/ai.controller';
import { authGuard } from '../middleware/authGuard';
import upload from '../middleware/upload';

const router = Router();

// Secure all AI endpoints to prevent Gemini API quota abuse
router.use(authGuard);

router.post('/chat', chatAssistant);
router.get('/chat/sessions', getChatSessions);
router.get('/chat/history/:sessionId', getChatHistory);
router.delete('/chat/session/:sessionId', deleteChatSession);
router.post('/draft-notice', draftNotice);
router.post('/summarize', summarizeDocument);
router.post('/ocr', upload.single('file'), ocrDocument);
router.post('/translate', translateText);

export default router;
