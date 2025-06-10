import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        process: true,
        user: true,
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        process: true,
        user: true,
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Erro ao buscar tarefa' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, dueDate, processId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const process = await prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      return res.status(404).json({ message: 'Processo não encontrado' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
        processId,
        userId,
      },
      include: {
        process: true,
        user: true,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, processId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    if (processId) {
      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return res.status(404).json({ message: 'Processo não encontrado' });
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate,
        processId,
      },
      include: {
        process: true,
        user: true,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        process: true,
        user: true,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Erro ao atualizar status da tarefa' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Erro ao deletar tarefa' });
  }
}; 