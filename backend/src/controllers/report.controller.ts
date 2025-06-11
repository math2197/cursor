import { Request, Response } from 'express';
import { prisma } from '../config/database';
import PDFDocument from 'pdfkit';

export const generateProcessReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const process = await prisma.process.findUnique({
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

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=processo-${process.id}.pdf`);
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Processo', { align: 'center' });
    doc.moveDown();

    // Informações do Processo
    doc.fontSize(16).text('Informações do Processo');
    doc.fontSize(12)
      .text(`Número: ${process.number}`)
      .text(`Título: ${process.title}`)
      .text(`Descrição: ${process.description || 'N/A'}`)
      .text(`Status: ${process.status}`)
      .text(`Data de Criação: ${process.createdAt.toLocaleDateString()}`)
      .text(`Data de Atualização: ${process.updatedAt.toLocaleDateString()}`);
    doc.moveDown();

    // Informações do Cliente
    doc.fontSize(16).text('Informações do Cliente');
    doc.fontSize(12)
      .text(`Nome: ${process.client.name}`)
      .text(`Email: ${process.client.email}`)
      .text(`Telefone: ${process.client.phone}`);
    doc.moveDown();

    // Tarefas
    doc.fontSize(16).text('Tarefas');
    process.tasks.forEach((task) => {
      doc.fontSize(12)
        .text(`- ${task.title}`)
        .text(`  Status: ${task.status}`)
        .text(`  Prazo: ${task.dueDate ? task.dueDate.toLocaleDateString() : 'N/A'}`)
        .text(`  Responsável: ${task.assignedTo.name}`);
    });
    doc.moveDown();

    // Tags
    doc.fontSize(16).text('Tags');
    process.tags.forEach((tag) => {
      doc.fontSize(12).text(`- ${tag.name}`);
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
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

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cliente-${client.id}.pdf`);
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Cliente', { align: 'center' });
    doc.moveDown();

    // Informações do Cliente
    doc.fontSize(16).text('Informações do Cliente');
    doc.fontSize(12)
      .text(`Nome: ${client.name}`)
      .text(`Email: ${client.email}`)
      .text(`Telefone: ${client.phone}`);
    doc.moveDown();

    // Processos
    doc.fontSize(16).text('Processos');
    client.processes.forEach((process) => {
      doc.fontSize(14).text(`Processo ${process.number}`);
      doc.fontSize(12)
        .text(`Título: ${process.title}`)
        .text(`Status: ${process.status}`)
        .text(`Data de Criação: ${process.createdAt.toLocaleDateString()}`);
      doc.moveDown();

      // Tarefas do Processo
      doc.fontSize(12).text('Tarefas:');
      process.tasks.forEach((task) => {
        doc.fontSize(10)
          .text(`- ${task.title}`)
          .text(`  Status: ${task.status}`)
          .text(`  Prazo: ${task.dueDate ? task.dueDate.toLocaleDateString() : 'N/A'}`)
          .text(`  Responsável: ${task.assignedTo.name}`);
      });
      doc.moveDown();

      // Tags do Processo
      doc.fontSize(12).text('Tags:');
      process.tags.forEach((tag) => {
        doc.fontSize(10).text(`- ${tag.name}`);
      });
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
};

export const generateTaskReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        process: {
          include: {
            client: true
          }
        },
        assignedTo: true
      }
    });

    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
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
    doc.fontSize(12)
      .text(`Título: ${task.title}`)
      .text(`Status: ${task.status}`)
      .text(`Data de Criação: ${task.createdAt.toLocaleDateString()}`);
    
    if (task.dueDate) {
      doc.text(`Data de Vencimento: ${task.dueDate.toLocaleDateString()}`);
    }
    if (task.description) {
      doc.text(`Descrição: ${task.description}`);
    }
    doc.moveDown();

    // Informações do Processo
    doc.fontSize(14).text('Informações do Processo');
    doc.fontSize(12)
      .text(`Número: ${task.process.number}`)
      .text(`Título: ${task.process.title}`)
      .text(`Status: ${task.process.status}`);
    doc.moveDown();

    // Informações do Cliente
    doc.fontSize(14).text('Informações do Cliente');
    doc.fontSize(12)
      .text(`Nome: ${task.process.client.name}`)
      .text(`Email: ${task.process.client.email}`);
    doc.moveDown();

    // Informações do Responsável
    doc.fontSize(14).text('Responsável');
    doc.fontSize(12)
      .text(`Nome: ${task.assignedTo.name}`)
      .text(`Email: ${task.assignedTo.email}`);

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
}; 