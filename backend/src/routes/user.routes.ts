import { Router } from 'express';
import Joi from 'joi';
import { register, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { Role } from '@prisma/client';

const router = Router();

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'USER').required()
});

const profileSchema = Joi.object({
  name: Joi.string().optional().notEmpty().messages({
    'string.empty': 'Nome não pode ser vazio'
  }),
  email: Joi.string().optional().email().messages({
    'string.email': 'Email inválido'
  })
});

const passwordSchema = Joi.object({
  currentPassword: Joi.string().notEmpty().messages({
    'string.empty': 'Senha atual é obrigatória'
  }),
  newPassword: Joi.string().min(6).messages({
    'string.min': 'Nova senha deve ter no mínimo 6 caracteres'
  })
});

router.use(authMiddleware);

router.post('/', roleMiddleware([Role.ADMIN]), validateRequest(userSchema), register);
router.get('/', roleMiddleware([Role.ADMIN]), getUsers);
router.get('/:id', getUserById);
router.put('/:id', validateRequest(userSchema), updateUser);
router.delete('/:id', roleMiddleware([Role.ADMIN]), deleteUser);

export default router; 