import multer from 'multer';
import { BadRequestError } from '../utils/customErrors';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|mov|mp3|wav|m4a|pdf|doc|docx|txt|xlsx|zip/;
    const mimeTypeMatches = file.mimetype.match(/image|video|audio|application\/pdf|application\/msword|text\/plain/);
    const extensionMatches = file.originalname.split('.').pop()?.toLowerCase().match(allowedTypes);

    if (mimeTypeMatches || extensionMatches) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Unsupported file type for vault storage'));
    }
  }
});

export default upload;
