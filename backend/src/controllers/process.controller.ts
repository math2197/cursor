import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getProcesses = async (_req: Request, res: Response) => {
  try {
    const processes = await prisma.process.findMany({
      include: {
        client: true,
        user: true,
        tasks: true,
        tags: true,
      },
    });
    return res.json(processes);
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getProcessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const process = await prisma.process.findUnique({
      where: { id: Number(id) },
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
  } catch (error) {
    console.error('Erro ao buscar processo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createProcess = async (req: Request, res: Response) => {
  try {
    const { number, title, description, status, clientId, userId } = req.body;

    const process = await prisma.process.create({
      data: {
        number,
        title,
        description,
        status,
        clientId: Number(clientId),
        userId: Number(userId),
      },
    });

    return res.status(201).json(process);
  } catch (error) {
    console.error('Erro ao criar processo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateProcess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { number, title, description, status, clientId, userId } = req.body;

    const process = await prisma.process.update({
      where: { id: Number(id) },
      data: {
        number,
        title,
        description,
        status,
        clientId: Number(clientId),
        userId: Number(userId),
      },
    });

    return res.json(process);
  } catch (error) {
    console.error('Erro ao atualizar processo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteProcess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.process.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar processo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
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