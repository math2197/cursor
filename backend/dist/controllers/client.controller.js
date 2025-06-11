"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClientById = exports.getClients = void 0;
const database_1 = require("../config/database");
const getClients = async (_req, res) => {
    try {
        const clients = await database_1.prisma.client.findMany();
        return res.json(clients);
    }
    catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.getClients = getClients;
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await database_1.prisma.client.findUnique({
            where: { id },
        });
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        return res.json(client);
    }
    catch (error) {
        console.error('Erro ao buscar cliente:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.getClientById = getClientById;
const createClient = async (req, res) => {
    try {
        const { name, email, phone, address, document } = req.body;
        const client = await database_1.prisma.client.create({
            data: {
                name,
                email,
                phone,
                address,
                document,
            },
        });
        return res.status(201).json(client);
    }
    catch (error) {
        console.error('Erro ao criar cliente:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.createClient = createClient;
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, document } = req.body;
        const client = await database_1.prisma.client.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                address,
                document,
            },
        });
        return res.json(client);
    }
    catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.updateClient = updateClient;
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.client.delete({
            where: { id },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar cliente:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.deleteClient = deleteClient;
//# sourceMappingURL=client.controller.js.map