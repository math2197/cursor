"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const tag_controller_1 = require("../controllers/tag.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_request_1 = require("../middlewares/validate-request");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const tagSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    color: joi_1.default.string().required()
});
router.use(auth_middleware_1.authMiddleware);
router.get('/', tag_controller_1.getTags);
router.get('/:id', tag_controller_1.getTagById);
router.post('/', (0, validate_request_1.validateRequest)(tagSchema), tag_controller_1.createTag);
router.put('/:id', (0, validate_request_1.validateRequest)(tagSchema), tag_controller_1.updateTag);
router.delete('/:id', (0, auth_middleware_1.roleMiddleware)([client_1.Role.ADMIN]), tag_controller_1.deleteTag);
exports.default = router;
//# sourceMappingURL=tag.routes.js.map