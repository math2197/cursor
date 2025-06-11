"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTagFromProcess = exports.addTagToProcess = exports.deleteProcess = exports.updateProcess = exports.createProcess = exports.getProcessById = exports.getProcesses = void 0;
const database_1 = require("../config/database");
const getProcesses = async (_req, res) => {
    try {
        const processes = await database_1.prisma.process.findMany({
            include: {
                client: true,
                user: true,
                tasks: true,
                tags: true,
            },
        });
        return res.json(processes);
    }
    catch (error) {
        console.error('Erro ao buscar processos:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.getProcesses = getProcesses;
const getProcessById = async (req, res) => {
    try {
        const { id } = req.params;
        const process = await database_1.prisma.process.findUnique({
            where: { id },
            include: {
                client: true,
                user: true,
                tasks: true,
                tags: true,
            },
        });
        if (!process) {
            return res.status(404).json({ message: 'Processo não encontrado' });
        }
        return res.json(process);
    }
    catch (error) {
        console.error('Erro ao buscar processo:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.getProcessById = getProcessById;
const createProcess = async (req, res) => {
    try {
        const { number, title, description, status, clientId, userId } = req.body;
        const process = await database_1.prisma.process.create({
            data: {
                number,
                title,
                description,
                status,
                clientId,
                userId,
            },
        });
        return res.status(201).json(process);
    }
    catch (error) {
        console.error('Erro ao criar processo:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.createProcess = createProcess;
const updateProcess = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, title, description, status, clientId, userId } = req.body;
        const process = await database_1.prisma.process.update({
            where: { id },
            data: {
                number,
                title,
                description,
                status,
                clientId,
                userId,
            },
        });
        return res.json(process);
    }
    catch (error) {
        console.error('Erro ao atualizar processo:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.updateProcess = updateProcess;
const deleteProcess = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.process.delete({
            where: { id },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar processo:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.deleteProcess = deleteProcess;
const addTagToProcess = async (req, res) => {
    try {
        const { id: processId, tagId } = req.params;
        const process = await database_1.prisma.process.findUnique({
            where: { id: processId },
        });
        if (!process) {
            return res.status(404).json({ message: 'Processo não encontrado' });
        }
        const tag = await database_1.prisma.tag.findUnique({
            where: { id: tagId },
        });
        if (!tag) {
            return res.status(404).json({ message: 'Etiqueta não encontrada' });
        }
        const updatedProcess = await database_1.prisma.process.update({
            where: { id: processId },
            data: {
                tags: {
                    connect: { id: tagId },
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                tags: true,
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        dueDate: true,
                    },
                },
            },
        });
        return res.json(updatedProcess);
    }
    catch (error) {
        console.error('Erro ao adicionar etiqueta ao processo:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.addTagToProcess = addTagToProcess;
const removeTagFromProcess = async (req, res) => {
    try {
        const { id: processId, tagId } = req.params;
        const process = await database_1.prisma.process.findUnique({
            where: { id: processId },
        });
        if (!process) {
            return res.status(404).json({ message: 'Processo não encontrado' });
        }
        const tag = await database_1.prisma.tag.findUnique({
            where: { id: tagId },
        });
        if (!tag) {
            return res.status(404).json({ message: 'Etiqueta não encontrada' });
        }
        const updatedProcess = await database_1.prisma.process.update({
            where: { id: processId },
            data: {
                tags: {
                    disconnect: { id: tagId },
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                tags: true,
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        dueDate: true,
                    },
                },
            },
        });
        return res.json(updatedProcess);
    }
    catch (error) {
        console.error('Erro ao remover etiqueta do processo:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.removeTagFromProcess = removeTagFromProcess;
//# sourceMappingURL=process.controller.js.map