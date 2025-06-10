import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
  addTagToProcess,
  removeTagFromProcess,
} from '../controllers/process.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getProcesses);
router.get('/:id', getProcessById);

router.post(
  '/',
  [
    body('number').notEmpty().withMessage('Número é obrigatório'),
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('description').optional(),
    body('status')
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'])
      .withMessage('Status inválido'),
    body('clientId').notEmpty().withMessage('Cliente é obrigatório'),
  ],
  validateRequest,
  createProcess
);

router.put(
  '/:id',
  [
    body('number').optional().notEmpty().withMessage('Número não pode ser vazio'),
    body('title').optional().notEmpty().withMessage('Título não pode ser vazio'),
    body('description').optional(),
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'])
      .withMessage('Status inválido'),
    body('clientId').optional().notEmpty().withMessage('Cliente não pode ser vazio'),
  ],
  validateRequest,
  updateProcess
);

router.delete('/:id', deleteProcess);

router.post(
  '/:id/tags/:tagId',
  addTagToProcess
);

router.delete(
  '/:id/tags/:tagId',
  removeTagFromProcess
);

export default router; 