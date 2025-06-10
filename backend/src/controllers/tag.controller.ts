import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        processes: true,
      },
    });

    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Erro ao buscar tags' });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        processes: true,
      },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag não encontrada' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({ message: 'Erro ao buscar tag' });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;

    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      return res.status(400).json({ message: 'Tag já existe' });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color,
      },
    });

    res.status(201).json(tag);
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Erro ao criar tag' });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag não encontrada' });
    }

    if (name && name !== tag.name) {
      const existingTag = await prisma.tag.findUnique({
        where: { name },
      });

      if (existingTag) {
        return res.status(400).json({ message: 'Tag já existe' });
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        color,
      },
    });

    res.json(updatedTag);
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ message: 'Erro ao atualizar tag' });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag não encontrada' });
    }

    await prisma.tag.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Erro ao deletar tag' });
  }
}; 