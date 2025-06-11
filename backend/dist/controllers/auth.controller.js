"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.register = exports.login = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'sua_chave_secreta', { expiresIn: '1d' });
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await database_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        return res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Erro no registro:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.register = register;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Token de atualização não fornecido' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || 'juridico_secret_key');
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'juridico_secret_key', { expiresIn: '1d' });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'juridico_secret_key', { expiresIn: '7d' });
        return res.json({
            token,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        console.error('Erro na atualização do token:', error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map