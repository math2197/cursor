"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_request_1 = require("../middlewares/validate-request");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const userSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid('ADMIN', 'USER').default('USER')
});
const updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string().valid('ADMIN', 'USER').optional()
});
router.post('/register', (0, validate_request_1.validateRequest)(userSchema), user_controller_1.register);
router.get('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), user_controller_1.getUsers);
router.get('/:id', auth_middleware_1.authMiddleware, user_controller_1.getUserById);
router.put('/:id', auth_middleware_1.authMiddleware, (0, validate_request_1.validateRequest)(updateUserSchema), user_controller_1.updateUser);
router.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map