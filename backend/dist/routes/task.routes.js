"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const task_controller_1 = require("../controllers/task.controller");
const validate_request_1 = require("../middlewares/validate-request");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const taskSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().allow(null, ''),
    status: joi_1.default.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required(),
    dueDate: joi_1.default.date().required(),
    processId: joi_1.default.string().required(),
    assignedToId: joi_1.default.string().required()
});
router.use(auth_middleware_1.authMiddleware);
router.get('/', task_controller_1.getTasks);
router.get('/:id', task_controller_1.getTaskById);
router.post('/', (0, validate_request_1.validateRequest)(taskSchema), task_controller_1.createTask);
router.put('/:id', (0, validate_request_1.validateRequest)(taskSchema), task_controller_1.updateTask);
router.patch('/:id/status', [
    body('status')
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
        .withMessage('Status inválido'),
], validate_request_1.validateRequest, task_controller_1.updateTaskStatus);
router.delete('/:id', (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map