"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const client_controller_1 = require("../controllers/client.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_request_1 = require("../middlewares/validate-request");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const clientSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    document: joi_1.default.string().required(),
    address: joi_1.default.string().required()
});
router.use(auth_middleware_1.authMiddleware);
router.get('/', client_controller_1.getClients);
router.get('/:id', client_controller_1.getClientById);
router.post('/', (0, validate_request_1.validateRequest)(clientSchema), client_controller_1.createClient);
router.put('/:id', (0, validate_request_1.validateRequest)(clientSchema), client_controller_1.updateClient);
router.delete('/:id', (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), client_controller_1.deleteClient);
exports.default = router;
//# sourceMappingURL=client.routes.js.map