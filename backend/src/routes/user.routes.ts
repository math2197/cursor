import { Router } from 'express';
import Joi from 'joi';
import { register, getUsers, getUserById, updateUser, deleteUser, updateProfile, updatePassword } from '../controllers/user.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { Role } from '@prisma/client';

const router = Router();

// Validação
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'USER').default('USER')
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('ADMIN', 'USER').optional()
});

// Rotas
router.post('/register', validateRequest(userSchema), register);
router.get('/', authMiddleware, roleMiddleware([Role.ADMIN]), getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateRequest(updateUserSchema), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware([Role.ADMIN]), deleteUser);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);

export default router; 