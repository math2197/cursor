import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        processes: true,
      },
    });

    res.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Erro ao buscar clientes' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        processes: true,
      },
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Erro ao buscar cliente' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, document, address } = req.body;

    const existingClient = await prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        document,
        address,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, document, address } = req.body;

    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (email && email !== client.email) {
      const existingClient = await prisma.client.findUnique({
        where: { email },
      });

      if (existingClient) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        document,
        address,
      },
    });

    res.json(updatedClient);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    await prisma.client.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Erro ao deletar cliente' });
  }
}; 