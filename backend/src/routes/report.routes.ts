import { Router } from 'express';
import Joi from 'joi';
import { generateProcessReport, generateClientReport } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';

const router = Router();

const idSchema = Joi.object({
  id: Joi.string().required()
});

router.use(authMiddleware);

router.get('/process/:id', validateRequest(idSchema), generateProcessReport);
router.get('/client/:id', validateRequest(idSchema), generateClientReport);

export default router; 