/**
 * Script de migração de dados do MySQL para PostgreSQL
 *
 * Este script conecta-se ao banco de dados MySQL existente,
 * extrai os dados e os insere no novo banco PostgreSQL usando Prisma.
 *
 * Paraasync function migrateData() {
	console.log("Iniciando migração de dados do MySQL para PostgreSQL...");

	// @ts-ignore - Ignorando erro de tipagem para o contexto de migração
	let mysqlConn = null;

	try {
		// Conecta ao banco de dados MySQL
		console.log("Conectando ao MySQL...");
		// @ts-ignore - Ignorando erro de tipagem para o contexto de migração
		mysqlConn = await mysql.createConnection(mysqlConfig);:
 * npm run build && node dist/scripts/migrateData.js
 */

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { createSlug } from "../utils/helpers.js";

// Carrega as variáveis de ambiente
dotenv.config();

// Inicializa o cliente Prisma para PostgreSQL
const prisma = new PrismaClient();

// Configuração da conexão MySQL
const mysqlConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "closet_db",
};

/**
 * Migra categorias do MySQL para PostgreSQL
 */
async function migrateCategories(mysqlConn) {
  console.log("Migrando categorias...");

  try {
    // Obtém todas as categorias do MySQL
    const [rows] = await mysqlConn.execute("SELECT * FROM categories");

    // Salva cada categoria no PostgreSQL
    for (const row of rows) {
      const slug = row.slug || createSlug(row.name);

      await prisma.category.create({
        data: {
          id: row.id,
          name: row.name,
          slug,
          description: row.description || null,
        },
      });
    }

    console.log(`${rows.length} categorias migradas com sucesso!`);
  } catch (error) {
    console.error("Erro ao migrar categorias:", error);
    throw error;
  }
}

/**
 * Migra produtos do MySQL para PostgreSQL
 */
async function migrateProducts(mysqlConn) {
  console.log("Migrando produtos...");

  try {
    // Obtém todos os produtos do MySQL
    const [rows] = await mysqlConn.execute("SELECT * FROM products");

    // Salva cada produto no PostgreSQL
    for (const row of rows) {
      const slug = row.slug || createSlug(row.name);

      // Formata os dados de acordo com o esquema Prisma
      const productData = {
        id: row.id,
        name: row.name,
        slug,
        price: row.price,
        originalPrice: row.original_price || null,
        description: row.description || null,
        shortDescription: row.short_description || null,
        mainImage: row.main_image || "default.jpg",
        discountPercentage: row.discount_percentage || 0,
        featured: row.featured === 1,
        stockQuantity: row.stock_quantity || 0,
        sku: row.sku || null,
        rating: row.rating || 5.0,
        sizes: row.sizes ? JSON.parse(row.sizes) : null,
        colors: row.colors ? JSON.parse(row.colors) : null,
      };

      // Cria o produto no PostgreSQL
      await prisma.product.create({
        data: productData,
      });
    }

    console.log(`${rows.length} produtos migrados com sucesso!`);
  } catch (error) {
    console.error("Erro ao migrar produtos:", error);
    throw error;
  }
}

/**
 * Migra imagens de produtos do MySQL para PostgreSQL
 */
async function migrateProductImages(mysqlConn) {
  console.log("Migrando imagens dos produtos...");

  try {
    // Obtém todas as imagens do MySQL
    const [rows] = await mysqlConn.execute("SELECT * FROM product_images");

    // Salva cada imagem no PostgreSQL
    for (const row of rows) {
      await prisma.productImage.create({
        data: {
          id: row.id,
          productId: row.product_id,
          url: row.url,
          alt: row.alt || null,
          order: row.order || 0,
        },
      });
    }

    console.log(`${rows.length} imagens migradas com sucesso!`);
  } catch (error) {
    console.error("Erro ao migrar imagens dos produtos:", error);
    throw error;
  }
}

/**
 * Migra relacionamento entre produtos e categorias
 */
async function migrateProductCategories(mysqlConn) {
  console.log("Migrando relações entre produtos e categorias...");

  try {
    // Obtém todas as relações do MySQL
    const [rows] = await mysqlConn.execute("SELECT * FROM product_categories");

    // Salva cada relação no PostgreSQL
    for (const row of rows) {
      await prisma.productCategory.create({
        data: {
          productId: row.product_id,
          categoryId: row.category_id,
        },
      });
    }

    console.log(`${rows.length} relações migradas com sucesso!`);
  } catch (error) {
    console.error(
      "Erro ao migrar relações entre produtos e categorias:",
      error
    );
    throw error;
  }
}

/**
 * Cria um usuário administrador padrão no PostgreSQL
 */
async function createDefaultAdmin() {
  console.log("Criando usuário administrador padrão...");

  try {
    // Verifica se já existe um usuário admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@closetmodafitness.com.br" },
    });

    if (!existingAdmin) {
      // Importa bcrypt para hash de senha
      const bcrypt = await import("bcrypt");

      // Cria o usuário admin
      await prisma.user.create({
        data: {
          name: "Administrador",
          email: "admin@closetmodafitness.com.br",
          password: await bcrypt.hash("admin123", 10),
          role: "ADMIN",
        },
      });

      console.log("Usuário administrador criado com sucesso!");
    } else {
      console.log("Usuário administrador já existe, pulando criação.");
    }
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error);
    throw error;
  }
}

/**
 * Função principal de migração
 */
async function migrateData() {
  console.log("Iniciando migração de dados do MySQL para PostgreSQL...");

  let mysqlConn = null as any;

  try {
    // Conecta ao banco de dados MySQL
    console.log("Conectando ao MySQL...");
    mysqlConn = await mysql.createConnection(mysqlConfig);

    // Executa a migração em sequência
    await migrateCategories(mysqlConn);
    await migrateProducts(mysqlConn);
    await migrateProductImages(mysqlConn);
    await migrateProductCategories(mysqlConn);
    await createDefaultAdmin();

    console.log("Migração concluída com sucesso!");
  } catch (error) {
    console.error("Erro durante a migração de dados:", error);
    process.exit(1);
  } finally {
    // Fecha as conexões
    // @ts-ignore - Ignorando erro de tipagem para o contexto de migração
    if (mysqlConn) await mysqlConn.end();
    await prisma.$disconnect();
  }
}

// Executa a migração
migrateData();
