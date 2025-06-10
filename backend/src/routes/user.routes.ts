import { Router } from 'express';
import { body } from 'express-validator';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  updatePassword,
} from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas protegidas por autenticação
router.use(authMiddleware);

// Rotas de perfil
router.put(
  '/profile',
  [
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('email').optional().isEmail().withMessage('Email inválido'),
  ],
  validateRequest,
  updateProfile
);

router.put(
  '/profile/password',
  [
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Nova senha deve ter no mínimo 6 caracteres'),
  ],
  validateRequest,
  updatePassword
);

// Rotas de administração
router.use(adminMiddleware);

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('role').isIn(['ADMIN', 'USER']).withMessage('Função inválida'),
  ],
  validateRequest,
  createUser
);

router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('role')
      .optional()
      .isIn(['ADMIN', 'USER'])
      .withMessage('Função inválida'),
  ],
  validateRequest,
  updateUser
);

router.delete('/:id', deleteUser);

export default router; 