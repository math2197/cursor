import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getDocumentsByProcess, uploadDocument, deleteDocument } from '../controllers/document.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.use(authMiddleware);

router.get('/process/:processId', getDocumentsByProcess);
router.post('/process/:processId', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);

export default router; 