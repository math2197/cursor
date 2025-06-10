import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        process: true,
        user: true,
        tags: true,
      },
    });
    return res.json(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
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
        tags: true,
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, dueDate, processId, userId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
        processId,
        userId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, processId, userId } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate,
        processId,
        userId,
      },
    });

    return res.json(task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
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

    await prisma.task.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 