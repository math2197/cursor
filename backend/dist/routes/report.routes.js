"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_request_1 = require("../middlewares/validate-request");
const router = (0, express_1.Router)();
const idSchema = joi_1.default.object({
    id: joi_1.default.string().required()
});
router.use(auth_middleware_1.authMiddleware);
router.get('/process/:id', (0, validate_request_1.validateRequest)(idSchema), report_controller_1.generateProcessReport);
router.get('/client/:id', (0, validate_request_1.validateRequest)(idSchema), report_controller_1.generateClientReport);
exports.default = router;
//# sourceMappingURL=report.routes.js.map