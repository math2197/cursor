"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({ message: 'Usuário não encontrado' });
            return;
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ message: 'Senha inválida' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
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
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
};
exports.login = login;
const createAdminUser = async () => {
    try {
        const adminExists = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
        });
        if (!adminExists) {
            const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
            await prisma.user.create({
                data: {
                    name: 'Administrador',
                    email: 'admin@admin.com',
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log('Usuário admin criado com sucesso!');
        }
    }
    catch (error) {
        console.error('Erro ao criar usuário admin:', error);
    }
};
exports.createAdminUser = createAdminUser;
//# sourceMappingURL=authController.js.map