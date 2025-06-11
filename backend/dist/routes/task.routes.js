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
    description: joi_1.default.string().optional(),
    status: joi_1.default.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required(),
    dueDate: joi_1.default.date().optional(),
    processId: joi_1.default.string().required(),
    assignedToId: joi_1.default.string().required()
});
const updateTaskSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    status: joi_1.default.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').optional(),
    dueDate: joi_1.default.date().optional(),
    processId: joi_1.default.string().optional(),
    assignedToId: joi_1.default.string().optional()
});
const updateStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').required()
});
router.get('/', auth_middleware_1.authMiddleware, task_controller_1.getTasks);
router.get('/:id', auth_middleware_1.authMiddleware, task_controller_1.getTaskById);
router.post('/', auth_middleware_1.authMiddleware, (0, validate_request_1.validateRequest)(taskSchema), task_controller_1.createTask);
router.put('/:id', auth_middleware_1.authMiddleware, (0, validate_request_1.validateRequest)(updateTaskSchema), task_controller_1.updateTask);
router.patch('/:id/status', auth_middleware_1.authMiddleware, (0, validate_request_1.validateRequest)(updateStatusSchema), task_controller_1.updateTaskStatus);
router.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map