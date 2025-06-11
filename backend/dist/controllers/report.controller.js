"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTaskReport = exports.generateClientReport = exports.generateProcessReport = void 0;
const database_1 = require("../config/database");
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateProcessReport = async (req, res) => {
    try {
        const { id } = req.params;
        const process = await database_1.prisma.process.findUnique({
            where: { id },
            include: {
                client: true,
                tasks: {
                    include: {
                        assignedTo: true,
                        tags: true
                    }
                },
                tags: true
            }
        });
        if (!process) {
            res.status(404).json({ message: 'Processo não encontrado' });
            return;
        }
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=processo-${process.id}.pdf`);
        doc.pipe(res);
        doc.fontSize(20).text('Relatório de Processo', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('Informações do Processo');
        doc.fontSize(12)
            .text(`Número: ${process.number}`)
            .text(`Título: ${process.title}`)
            .text(`Descrição: ${process.description || 'N/A'}`)
            .text(`Status: ${process.status}`)
            .text(`Data de Criação: ${process.createdAt.toLocaleDateString()}`)
            .text(`Data de Atualização: ${process.updatedAt.toLocaleDateString()}`);
        doc.moveDown();
        doc.fontSize(16).text('Informações do Cliente');
        doc.fontSize(12)
            .text(`Nome: ${process.client.name}`)
            .text(`Email: ${process.client.email}`)
            .text(`Telefone: ${process.client.phone}`);
        doc.moveDown();
        doc.fontSize(16).text('Tarefas');
        process.tasks.forEach((task) => {
            doc.fontSize(12)
                .text(`- ${task.title}`)
                .text(`  Status: ${task.status}`)
                .text(`  Prazo: ${task.dueDate ? task.dueDate.toLocaleDateString() : 'N/A'}`)
                .text(`  Responsável: ${task.assignedTo.name}`);
        });
        doc.moveDown();
        doc.fontSize(16).text('Tags');
        process.tags.forEach((tag) => {
            doc.fontSize(12).text(`- ${tag.name}`);
        });
        doc.end();
    }
    catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
};
exports.generateProcessReport = generateProcessReport;
const generateClientReport = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await database_1.prisma.client.findUnique({
            where: { id },
            include: {
                processes: {
                    include: {
                        tasks: {
                            include: {
                                assignedTo: true,
                                tags: true
                            }
                        },
                        tags: true
                    }
                }
            }
        });
        if (!client) {
            res.status(404).json({ message: 'Cliente não encontrado' });
            return;
        }
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=cliente-${client.id}.pdf`);
        doc.pipe(res);
        doc.fontSize(20).text('Relatório de Cliente', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('Informações do Cliente');
        doc.fontSize(12)
            .text(`Nome: ${client.name}`)
            .text(`Email: ${client.email}`)
            .text(`Telefone: ${client.phone}`);
        doc.moveDown();
        doc.fontSize(16).text('Processos');
        client.processes.forEach((process) => {
            doc.fontSize(14).text(`Processo ${process.number}`);
            doc.fontSize(12)
                .text(`Título: ${process.title}`)
                .text(`Status: ${process.status}`)
                .text(`Data de Criação: ${process.createdAt.toLocaleDateString()}`);
            doc.moveDown();
            doc.fontSize(12).text('Tarefas:');
            process.tasks.forEach((task) => {
                doc.fontSize(10)
                    .text(`- ${task.title}`)
                    .text(`  Status: ${task.status}`)
                    .text(`  Prazo: ${task.dueDate ? task.dueDate.toLocaleDateString() : 'N/A'}`)
                    .text(`  Responsável: ${task.assignedTo.name}`);
            });
            doc.moveDown();
            doc.fontSize(12).text('Tags:');
            process.tags.forEach((tag) => {
                doc.fontSize(10).text(`- ${tag.name}`);
            });
            doc.moveDown();
        });
        doc.end();
    }
    catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
};
exports.generateClientReport = generateClientReport;
const generateTaskReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.body;
        const task = await database_1.prisma.task.findUnique({
            where: { id },
            include: {
                process: {
                    include: {
                        client: true,
                    },
                },
                user: true,
            },
        });
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=task-${task.id}.pdf`);
        doc.pipe(res);
        doc.fontSize(20).text('Relatório de Tarefa', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text('Informações da Tarefa');
        doc.fontSize(12).text(`Título: ${task.title}`);
        doc.text(`Status: ${task.status}`);
        doc.text(`Data de Criação: ${task.createdAt.toLocaleDateString()}`);
        if (task.dueDate) {
            doc.text(`Data de Vencimento: ${task.dueDate.toLocaleDateString()}`);
        }
        if (task.description) {
            doc.text(`Descrição: ${task.description}`);
        }
        doc.moveDown();
        doc.fontSize(14).text('Informações do Processo');
        doc.fontSize(12).text(`Número: ${task.process.number}`);
        doc.text(`Título: ${task.process.title}`);
        doc.text(`Status: ${task.process.status}`);
        doc.moveDown();
        doc.fontSize(14).text('Informações do Cliente');
        doc.fontSize(12).text(`Nome: ${task.process.client.name}`);
        doc.text(`Email: ${task.process.client.email}`);
        doc.moveDown();
        doc.fontSize(14).text('Responsável');
        doc.fontSize(12).text(`Nome: ${task.user.name}`);
        doc.text(`Email: ${task.user.email}`);
        doc.end();
    }
    catch (error) {
        console.error('Generate task report error:', error);
        res.status(500).json({ message: 'Erro ao gerar relatório da tarefa' });
    }
};
exports.generateTaskReport = generateTaskReport;
//# sourceMappingURL=report.controller.js.map