import { Router } from 'express';
import { body } from 'express-validator';
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} from '../controllers/tag.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getTags);

router.get('/:id', getTagById);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('color').notEmpty().withMessage('Cor é obrigatória'),
  ],
  validateRequest,
  createTag
);

router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('color').optional().notEmpty().withMessage('Cor não pode ser vazia'),
  ],
  validateRequest,
  updateTag
);

router.delete('/:id', deleteTag);

export default router; 