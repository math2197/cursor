"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const user_controller_1 = require("../controllers/user.controller");
const validate_request_1 = require("../middlewares/validate-request");
const router = (0, express_1.Router)();
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid('ADMIN', 'USER').default('USER')
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
router.post('/register', (0, validate_request_1.validateRequest)(registerSchema), user_controller_1.register);
router.post('/login', (0, validate_request_1.validateRequest)(loginSchema), user_controller_1.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map