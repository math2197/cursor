"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.updateTag = exports.createTag = exports.getTagById = exports.getTags = void 0;
const database_1 = require("../config/database");
const getTags = async (_req, res) => {
    try {
        const tags = await database_1.prisma.tag.findMany();
        return res.json(tags);
    }
    catch (error) {
        console.error('Erro ao buscar tags:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.getTags = getTags;
const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await database_1.prisma.tag.findUnique({
            where: { id },
        });
        if (!tag) {
            return res.status(404).json({ message: 'Tag não encontrada' });
        }
        return res.json(tag);
    }
    catch (error) {
        console.error('Erro ao buscar tag:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.getTagById = getTagById;
const createTag = async (req, res) => {
    try {
        const { name, color } = req.body;
        const tag = await database_1.prisma.tag.create({
            data: {
                name,
                color,
            },
        });
        return res.status(201).json(tag);
    }
    catch (error) {
        console.error('Erro ao criar tag:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.createTag = createTag;
const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        const tag = await database_1.prisma.tag.update({
            where: { id },
            data: {
                name,
                color,
            },
        });
        return res.json(tag);
    }
    catch (error) {
        console.error('Erro ao atualizar tag:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.updateTag = updateTag;
const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.tag.delete({
            where: { id },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar tag:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.deleteTag = deleteTag;
//# sourceMappingURL=tag.controller.js.map