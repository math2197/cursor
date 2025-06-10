import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getClients = async (_req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany();
    return res.json(clients);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    return res.json(client);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, document } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        document,
      },
    });

    return res.status(201).json(client);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, document } = req.body;

    const client = await prisma.client.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        phone,
        address,
        document,
      },
    });

    return res.json(client);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 