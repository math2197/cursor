import { Router } from 'express';
import Joi from 'joi';
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} from '../controllers/tag.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { Role } from '@prisma/client';

const router = Router();

const tagSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().required()
});

router.use(authMiddleware);

router.get('/', getTags);

router.get('/:id', getTagById);

router.post('/', validateRequest(tagSchema), createTag);

router.put('/:id', validateRequest(tagSchema), updateTag);

router.delete('/:id', roleMiddleware([Role.ADMIN]), deleteTag);

export default router; 