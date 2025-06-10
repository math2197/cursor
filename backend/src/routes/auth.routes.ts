import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate-request';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  validateRequest,
  login
);

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
  ],
  validateRequest,
  register
);

export default router; 