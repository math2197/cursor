import { Router } from 'express';
import Joi from 'joi';
import { register, login } from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validate-request';

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'USER').default('USER')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router; 