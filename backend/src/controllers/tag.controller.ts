import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getTags = async (_req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    return res.json(tags);
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag não encontrada' });
    }

    return res.json(tag);
  } catch (error) {
    console.error('Erro ao buscar tag:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;

    const tag = await prisma.tag.create({
      data: {
        name,
        color,
      },
    });

    return res.status(201).json(tag);
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        color,
      },
    });

    return res.json(tag);
  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tag.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 