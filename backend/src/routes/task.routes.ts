import { Router } from 'express';
import Joi from 'joi';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/task.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Validação
const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required(),
  dueDate: Joi.date().optional(),
  processId: Joi.string().required(),
  assignedToId: Joi.string().required()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').optional(),
  dueDate: Joi.date().optional(),
  processId: Joi.string().optional(),
  assignedToId: Joi.string().optional()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required()
});

// Rotas
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById);
router.post('/', authMiddleware, validateRequest(taskSchema), createTask);
router.put('/:id', authMiddleware, validateRequest(updateTaskSchema), updateTask);
router.patch('/:id/status', authMiddleware, validateRequest(updateStatusSchema), updateTaskStatus);
router.delete('/:id', authMiddleware, roleMiddleware([Role.ADMIN]), deleteTask);

export default router; 