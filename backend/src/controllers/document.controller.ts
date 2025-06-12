import { Request, Response } from 'express';
import { prisma } from '../config/database';
import path from 'path';
import fs from 'fs';

export const getDocumentsByProcess = async (req: Request, res: Response) => {
  try {
    const { processId } = req.params;
    const documents = await prisma.document.findMany({
      where: { processId },
      include: { uploadedBy: { select: { id: true, name: true, email: true } } },
    });
    return res.json(documents);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const { processId } = req.params;
    const uploadedById = req.user?.id;
    if (!uploadedById) return res.status(401).json({ message: 'Usuário não autenticado' });
    if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado' });
    const file = req.file;
    const name = file.originalname;
    const url = `/uploads/${file.filename}`;
    const document = await prisma.document.create({
      data: { name, url, processId, uploadedById },
    });
    return res.status(201).json(document);
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({ where: { id } });
    if (document) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(document.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await prisma.document.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 