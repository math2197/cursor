import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/task.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('description').optional(),
    body('status')
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Status inválido'),
    body('dueDate').optional().isISO8601().withMessage('Data inválida'),
    body('processId').notEmpty().withMessage('Processo é obrigatório'),
  ],
  validateRequest,
  createTask
);

router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Título não pode ser vazio'),
    body('description').optional(),
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Status inválido'),
    body('dueDate').optional().isISO8601().withMessage('Data inválida'),
    body('processId').optional().notEmpty().withMessage('Processo não pode ser vazio'),
  ],
  validateRequest,
  updateTask
);

router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Status inválido'),
  ],
  validateRequest,
  updateTaskStatus
);

router.delete('/:id', deleteTask);

export default router; 