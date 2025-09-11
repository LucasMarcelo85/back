import bcrypt from "bcrypt";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

dotenv.config();

// Login de usuário
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`Tentativa de login para o e-mail: ${email}`);

    if (!email || !password) {
      console.log("Login falhou: Email ou senha ausentes");
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    // Busca usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`Login falhou: Usuário com email ${email} não encontrado`);
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Login falhou: Senha incorreta para o email ${email}`);
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      console.error("JWT_SECRET não está definido no arquivo .env");
      return res
        .status(500)
        .json({ message: "Erro de configuração no servidor" });
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secretKey,
      {
        expiresIn: "1d", // Token expira em 1 dia
      }
    );

    // Retorna o token e dados básicos do usuário
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    // Log detalhado do erro para melhor depuração
    if (error instanceof Error) {
      console.error(`Detalhes do erro: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    }

    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Registrar um novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    console.log(
      `Tentativa de registro recebida: ${JSON.stringify(req.body, null, 2)}`
    );
    const { name, email, password, phone, role } = req.body;

    // Verifica se já existe um usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`Registro falhou: Email ${email} já está em uso`);
      return res
        .status(400)
        .json({ message: "Este email já está sendo utilizado" });
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Cria o novo usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    console.log(
      `Usuário criado com sucesso: ${newUser.id}, ${newUser.name}, ${newUser.email}`
    );

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    // Log detalhado do erro para melhor depuração
    if (error instanceof Error) {
      console.error(`Detalhes do erro de registro: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    }

    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Verificar token atual
export const verifyToken = (req: Request, res: Response) => {
  // Se chegou aqui, o middleware de autenticação já validou o token
  res.json({
    valid: true,
    user: req.user,
  });
};

// Atualizar perfil do usuário
export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Garantir que o usuário está autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    // Buscar usuário atual
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Preparar dados para atualização
    const updateData: { name?: string; email?: string; password?: string } = {};

    // Atualizar nome se fornecido
    if (name) {
      updateData.name = name;
    }

    // Atualizar email se fornecido e diferente do atual
    if (email && email !== currentUser.email) {
      // Verificar se o novo email já está em uso
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Este email já está sendo utilizado" });
      }

      updateData.email = email;
    }

    // Atualizar senha se fornecida a senha atual e nova senha
    if (currentPassword && newPassword) {
      // Verificar se a senha atual está correta
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }

      // Hash da nova senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      updateData.password = hashedPassword;
    }

    // Se não há dados para atualizar
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Nenhum dado fornecido para atualização" });
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Retornar dados atualizados (sem a senha)
    res.json({
      message: "Perfil atualizado com sucesso",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// Obter perfil do usuário atual
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Garantir que o usuário está autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const userId = req.user.id;

    // Buscar dados completos do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Retornar dados do usuário (sem a senha)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};
