import type { Request, Response } from "express";
import { createSlug } from "../utils/helpers.js";
import prisma from "../utils/prisma.js";

// GET /api/categories - Recupera todas as categorias
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ message: "Erro ao buscar categorias" });
  }
};

// GET /api/categories/:id - Recupera uma categoria pelo ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    res.json(category);
  } catch (error) {
    console.error(`Erro ao buscar categoria por ID:`, error);
    res.status(500).json({ message: "Erro ao buscar categoria" });
  }
};

// GET /api/categories/slug/:slug - Recupera uma categoria pelo slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    res.json(category);
  } catch (error) {
    console.error(`Erro ao buscar categoria por slug:`, error);
    res.status(500).json({ message: "Erro ao buscar categoria" });
  }
};

// POST /api/categories - Cria uma nova categoria
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Nome da categoria é obrigatório" });
    }

    // Gera o slug a partir do nome
    const slug = createSlug(name);

    // Verifica se já existe uma categoria com este slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Já existe uma categoria com este nome" });
    }

    // Cria a nova categoria
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    res.status(201).json({
      message: "Categoria criada com sucesso",
      category,
    });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ message: "Erro ao criar categoria" });
  }
};

// PUT /api/categories/:id - Atualiza uma categoria
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, description } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Verifica se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    // Preparar dados para atualização
    const updateData: { name?: string; slug?: string; description?: string } =
      {};

    // Se o nome foi alterado, atualiza o slug também
    if (name && name !== existingCategory.name) {
      updateData.name = name;
      updateData.slug = createSlug(name);

      // Verifica se o novo slug já existe
      const slugExists = await prisma.category.findUnique({
        where: {
          slug: updateData.slug,
          NOT: { id },
        },
      });

      if (slugExists) {
        return res
          .status(400)
          .json({ message: "Já existe uma categoria com este nome" });
      }
    }

    // Atualiza a descrição se fornecida
    if (description !== undefined) {
      updateData.description = description;
    }

    // Atualiza a categoria
    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Categoria atualizada com sucesso",
      category,
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ message: "Erro ao atualizar categoria" });
  }
};

// DELETE /api/categories/:id - Remove uma categoria
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Verifica se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    // Verifica se existem produtos associados a esta categoria
    const productsWithCategory = await prisma.productCategory.findMany({
      where: { categoryId: id },
    });

    if (productsWithCategory.length > 0) {
      return res.status(400).json({
        message:
          "Não é possível remover esta categoria porque existem produtos associados a ela",
      });
    }

    // Remove a categoria
    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Categoria removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
    res.status(500).json({ message: "Erro ao remover categoria" });
  }
};
