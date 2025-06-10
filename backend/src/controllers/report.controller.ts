import { Request, Response } from 'express';
import { prisma } from '../config/database';
import PDFDocument from 'pdfkit';
import { Process, Client, Task, Tag } from '@prisma/client';

export const generateProcessReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const process = await prisma.process.findUnique({
      where: { id },
      include: {
        client: true,
        user: true,
        tasks: true,
        tags: true,
      },
    });

    if (!process) {
      res.status(404).json({ message: 'Processo não encontrado' });
      return;
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=processo-${process.number}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Relatório de Processo', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Número: ${process.number}`);
    doc.text(`Título: ${process.title}`);
    doc.text(`Descrição: ${process.description}`);
    doc.text(`Status: ${process.status}`);
    doc.text(`Cliente: ${process.client.name}`);
    doc.text(`Responsável: ${process.user.name}`);
    doc.moveDown();

    doc.fontSize(16).text('Tarefas');
    process.tasks.forEach((task: Task) => {
      doc.fontSize(12).text(`- ${task.title}: ${task.status}`);
    });

    doc.fontSize(16).text('Tags');
    process.tags.forEach((tag: Tag) => {
      doc.fontSize(12).text(`- ${tag.name}`);
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const generateClientReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        processes: {
          include: {
            tasks: true,
            tags: true,
          },
        },
      },
    });

    if (!client) {
      res.status(404).json({ message: 'Cliente não encontrado' });
      return;
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cliente-${client.name}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Relatório de Cliente', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Nome: ${client.name}`);
    doc.text(`Email: ${client.email}`);
    doc.text(`Telefone: ${client.phone}`);
    doc.text(`Documento: ${client.document}`);
    doc.text(`Endereço: ${client.address}`);
    doc.moveDown();

    doc.fontSize(16).text('Processos');
    client.processes.forEach((process: Process & { tasks: Task[]; tags: Tag[] }) => {
      doc.fontSize(14).text(`Processo ${process.number}`);
      doc.fontSize(12).text(`Título: ${process.title}`);
      doc.text(`Status: ${process.status}`);
      doc.text(`Tarefas: ${process.tasks.length}`);
      doc.text(`Tags: ${process.tags.map((tag: Tag) => tag.name).join(', ')}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const generateTaskReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const task = await prisma.task.findUnique({
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

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=task-${task.id}.pdf`);

    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Tarefa', { align: 'center' });
    doc.moveDown();

    // Informações da tarefa
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

    // Informações do processo
    doc.fontSize(14).text('Informações do Processo');
    doc.fontSize(12).text(`Número: ${task.process.number}`);
    doc.text(`Título: ${task.process.title}`);
    doc.text(`Status: ${task.process.status}`);
    doc.moveDown();

    // Informações do cliente
    doc.fontSize(14).text('Informações do Cliente');
    doc.fontSize(12).text(`Nome: ${task.process.client.name}`);
    doc.text(`Email: ${task.process.client.email}`);
    doc.moveDown();

    // Responsável
    doc.fontSize(14).text('Responsável');
    doc.fontSize(12).text(`Nome: ${task.user.name}`);
    doc.text(`Email: ${task.user.email}`);

    doc.end();
  } catch (error) {
    console.error('Generate task report error:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório da tarefa' });
  }
}; 