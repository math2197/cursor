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
    role: joi_1.default.string().valid('ADMIN', 'USER').required()
});
const profileSchema = joi_1.default.object({
    name: joi_1.default.string().optional().notEmpty().messages({
        'string.empty': 'Nome não pode ser vazio'
    }),
    email: joi_1.default.string().optional().email().messages({
        'string.email': 'Email inválido'
    })
});
const passwordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().notEmpty().messages({
        'string.empty': 'Senha atual é obrigatória'
    }),
    newPassword: joi_1.default.string().min(6).messages({
        'string.min': 'Nova senha deve ter no mínimo 6 caracteres'
    })
});
router.use(auth_middleware_1.authMiddleware);
router.post('/', (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), (0, validate_request_1.validateRequest)(userSchema), user_controller_1.register);
router.get('/', (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), user_controller_1.getUsers);
router.get('/:id', user_controller_1.getUserById);
router.put('/:id', (0, validate_request_1.validateRequest)(userSchema), user_controller_1.updateUser);
router.delete('/:id', (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map