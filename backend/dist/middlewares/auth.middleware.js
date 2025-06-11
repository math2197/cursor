"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Token não fornecido' });
        return;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        res.status(401).json({ message: 'Token mal formatado' });
        return;
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({ message: 'Token mal formatado' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Usuário não autenticado' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Acesso negado' });
            return;
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=auth.middleware.js.map