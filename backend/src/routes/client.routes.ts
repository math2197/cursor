import { Router } from 'express';
import { body } from 'express-validator';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from '../controllers/client.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getClients);

router.get('/:id', getClientById);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
    body('document').optional().isLength({ min: 11 }).withMessage('Documento inválido'),
  ],
  validateRequest,
  createClient
);

router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
    body('document').optional().isLength({ min: 11 }).withMessage('Documento inválido'),
  ],
  validateRequest,
  updateClient
);

router.delete('/:id', deleteClient);

export default router; 