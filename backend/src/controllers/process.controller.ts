import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProcesses = async (req: Request, res: Response) => {
  try {
    const processes = await prisma.process.findMany({
      include: {
        client: true,
        tasks: true,
        tags: true,
      },
    });

    res.json(processes);
  } catch (error) {
    console.error('Get processes error:', error);
    res.status(500).json({ message: 'Erro ao buscar processos' });
  }
};

export const getProcessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const process = await prisma.process.findUnique({
      where: { id },
      include: {
        client: true,
        tasks: true,
        tags: true,
      },
    });

    if (!process) {
      return res.status(404).json({ message: 'Processo não encontrado' });
    }

    res.json(process);
  } catch (error) {
    console.error('Get process error:', error);
    res.status(500).json({ message: 'Erro ao buscar processo' });
  }
};

export const createProcess = async (req: Request, res: Response) => {
  try {
    const { number, title, description, status, clientId } = req.body;

    const existingProcess = await prisma.process.findUnique({
      where: { number },
    });

    if (existingProcess) {
      return res.status(400).json({ message: 'Número de processo já cadastrado' });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const process = await prisma.process.create({
      data: {
        number,
        title,
        description,
        status,
        clientId,
      },
      include: {
        client: true,
        tasks: true,
        tags: true,
      },
    });

    res.status(201).json(process);
  } catch (error) {
    console.error('Create process error:', error);
    res.status(500).json({ message: 'Erro ao criar processo' });
  }
};

export const updateProcess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { number, title, description, status, clientId } = req.body;

    const process = await prisma.process.findUnique({
      where: { id },
    });

    if (!process) {
      return res.status(404).json({ message: 'Processo não encontrado' });
    }

    if (number && number !== process.number) {
      const existingProcess = await prisma.process.findUnique({
        where: { number },
      });

      if (existingProcess) {
        return res.status(400).json({ message: 'Número de processo já cadastrado' });
      }
    }

    if (clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }
    }

    const updatedProcess = await prisma.process.update({
      where: { id },
      data: {
        number,
        title,
        description,
        status,
        clientId,
      },
      include: {
        client: true,
        tasks: true,
        tags: true,
      },
    });

    res.json(updatedProcess);
  } catch (error) {
    console.error('Update process error:', error);
    res.status(500).json({ message: 'Erro ao atualizar processo' });
  }
};

export const deleteProcess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const process = await prisma.process.findUnique({
      where: { id },
    });

    if (!process) {
      return res.status(404).json({ message: 'Processo não encontrado' });
    }

    await prisma.process.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete process error:', error);
    res.status(500).json({ message: 'Erro ao deletar processo' });
  }
};

export const addTagToProcess = async (req: Request, res: Response) => {
  try {
    const { id: processId, tagId } = req.params;

    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      return res.status(404).json({ message: 'Processo não encontrado' });
    }

    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta não encontrada' });
    }

    const updatedProcess = await prisma.process.update({
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
  } catch (error) {
    console.error('Erro ao adicionar etiqueta ao processo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const removeTagFromProcess = async (req: Request, res: Response) => {
  try {
    const { id: processId, tagId } = req.params;

    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      return res.status(404).json({ message: 'Processo não encontrado' });
    }

    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta não encontrada' });
    }

    const updatedProcess = await prisma.process.update({
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
  } catch (error) {
    console.error('Erro ao remover etiqueta do processo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 