"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const process_controller_1 = require("../controllers/process.controller");
const validate_request_1 = require("../middlewares/validate-request");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const processSchema = joi_1.default.object({
    number: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().allow(null, ''),
    status: joi_1.default.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED').required(),
    clientId: joi_1.default.string().required(),
    userId: joi_1.default.string().required()
});
router.use(auth_middleware_1.authMiddleware);
router.get('/', process_controller_1.getProcesses);
router.get('/:id', process_controller_1.getProcessById);
router.post('/', (0, validate_request_1.validateRequest)(processSchema), process_controller_1.createProcess);
router.put('/:id', (0, validate_request_1.validateRequest)(processSchema), process_controller_1.updateProcess);
router.delete('/:id', (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), process_controller_1.deleteProcess);
router.post('/:id/tags/:tagId', process_controller_1.addTagToProcess);
router.delete('/:id/tags/:tagId', process_controller_1.removeTagFromProcess);
exports.default = router;
//# sourceMappingURL=process.routes.js.map