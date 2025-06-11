"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateProfile = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const register = async (req, res) => {
    try {
        const { name, email, password, role = 'USER' } = req.body;
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({ message: 'Email já cadastrado' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await database_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ message: 'Credenciais inválidas' });
            return;
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ message: 'Credenciais inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1d' });
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
};
exports.login = login;
const getUsers = async (_req, res) => {
    try {
        const users = await database_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await database_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        const updatedUser = await database_1.prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role: role
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        await database_1.prisma.user.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
};
exports.deleteUser = deleteUser;
const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, email } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        if (email && email !== user.email) {
            const existingUser = await database_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }
        }
        const updatedUser = await database_1.prisma.user.update({
            where: { id },
            data: {
                name: name || user.name,
                email: email || user.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.json(updatedUser);
    }
    catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Senha atual inválida' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await database_1.prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword,
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=user.controller.js.map