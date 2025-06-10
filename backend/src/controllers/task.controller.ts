import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getTasks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        process: true,
        assignedTo: true,
        tags: true
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
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
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ message: 'Erro ao buscar tarefa' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status, dueDate, processId, assignedToId } = req.body;

    const task = await prisma.task.create({
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
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, processId, assignedToId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }

    const updatedTask = await prisma.task.update({
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
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
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

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }

    await prisma.task.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ message: 'Erro ao deletar tarefa' });
  }
}; 