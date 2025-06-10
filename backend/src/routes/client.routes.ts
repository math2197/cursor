import { Router } from 'express';
import Joi from 'joi';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from '../controllers/client.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { Role } from '@prisma/client';

const router = Router();

const clientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  document: Joi.string().required(),
  address: Joi.string().required()
});

router.use(authMiddleware);

router.get('/', getClients);

router.get('/:id', getClientById);

router.post('/', validateRequest(clientSchema), createClient);

router.put('/:id', validateRequest(clientSchema), updateClient);

router.delete('/:id', roleMiddleware([Role.ADMIN]), deleteClient);

export default router; 