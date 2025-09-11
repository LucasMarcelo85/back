/**
 * Script para criar um usuário administrador
 *
 * Execute com: npm run create:admin -- nome@email.com senha123 "Nome do Administrador"
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();
async function createAdmin() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Uso: npm run create:admin -- email senha "Nome do Admin"');
        process.exit(1);
    }
    const email = args[0];
    const password = args[1];
    const name = args[2] || "Administrador";
    try {
        // Verificar se o email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            console.error(`Usuário com email ${email} já existe.`);
            process.exit(1);
        }
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        // Criar novo usuário administrador
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "ADMIN",
            },
        });
        console.log(`Administrador criado com sucesso:`);
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Função: ${user.role}`);
    }
    catch (error) {
        console.error("Erro ao criar usuário administrador:", error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
createAdmin();
//# sourceMappingURL=createAdmin.js.map