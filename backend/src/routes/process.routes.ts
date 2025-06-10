import { Router } from 'express';
import Joi from 'joi';
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
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

const processSchema = Joi.object({
  number: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED').required(),
  clientId: Joi.string().required(),
  userId: Joi.string().required()
});

router.use(authMiddleware);

router.get('/', getProcesses);
router.get('/:id', getProcessById);

router.post('/', validateRequest(processSchema), createProcess);

router.put('/:id', validateRequest(processSchema), updateProcess);

router.delete('/:id', roleMiddleware([Role.ADMIN]), deleteProcess);

router.post(
  '/:id/tags/:tagId',
  addTagToProcess
);

router.delete(
  '/:id/tags/:tagId',
  removeTagFromProcess
);

export default router; 