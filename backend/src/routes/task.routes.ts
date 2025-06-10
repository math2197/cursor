import { Router } from 'express';
import Joi from 'joi';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/task.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required(),
  dueDate: Joi.date().required(),
  processId: Joi.string().required(),
  assignedToId: Joi.string().required()
});

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);

router.post('/', validateRequest(taskSchema), createTask);

router.put('/:id', validateRequest(taskSchema), updateTask);

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

router.delete('/:id', roleMiddleware([Role.ADMIN]), deleteTask);

export default router; 