import { Router } from 'express';
import { body } from 'express-validator';
import {
  generateProcessReport,
  generateClientReport,
  generateTaskReport,
} from '../controllers/report.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/process/:id',
  [
    body('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
    body('endDate').optional().isISO8601().withMessage('Data final inválida'),
  ],
  validateRequest,
  generateProcessReport
);

router.post(
  '/client/:id',
  [
    body('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
    body('endDate').optional().isISO8601().withMessage('Data final inválida'),
  ],
  validateRequest,
  generateClientReport
);

router.post(
  '/task/:id',
  [
    body('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
    body('endDate').optional().isISO8601().withMessage('Data final inválida'),
  ],
  validateRequest,
  generateTaskReport
);

export default router; 