"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskStatus = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const database_1 = require("../config/database");
const getTasks = async (_req, res) => {
    try {
        const tasks = await database_1.prisma.task.findMany({
            include: {
                process: true,
                assignedTo: true,
                tags: true
            }
        });
        res.json(tasks);
    }
    catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ message: 'Erro ao buscar tarefas' });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await database_1.prisma.task.findUnique({
            where: { id },
            include: {
                process: true,
                assignedTo: true,
                tags: true
            }
        });
        if (!task) {
            res.status(404).json({ message: 'Tarefa não encontrada' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        res.status(500).json({ message: 'Erro ao buscar tarefa' });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, processId, assignedToId } = req.body;
        const task = await database_1.prisma.task.create({
            data: {
                title,
                description,
                status,
                dueDate: new Date(dueDate),
                processId,
                assignedToId
            },
            include: {
                process: true,
                assignedTo: true,
                tags: true
            }
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ message: 'Erro ao criar tarefa' });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate, processId, assignedToId } = req.body;
        const task = await database_1.prisma.task.findUnique({
            where: { id }
        });
        if (!task) {
            res.status(404).json({ message: 'Tarefa não encontrada' });
            return;
        }
        const updatedTask = await database_1.prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                processId,
                assignedToId
            },
            include: {
                process: true,
                assignedTo: true,
                tags: true
            }
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }
};
exports.updateTask = updateTask;
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const task = await database_1.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        const updatedTask = await database_1.prisma.task.update({
            where: { id },
            data: { status },
            include: {
                process: true,
                user: true,
            },
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Update task status error:', error);
        res.status(500).json({ message: 'Erro ao atualizar status da tarefa' });
    }
};
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await database_1.prisma.task.findUnique({
            where: { id }
        });
        if (!task) {
            res.status(404).json({ message: 'Tarefa não encontrada' });
            return;
        }
        await database_1.prisma.task.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ message: 'Erro ao deletar tarefa' });
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.controller.js.map