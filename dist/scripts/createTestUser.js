import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
async function createTestUser() {
    try {
        const email = "teste@exemplo.com";
        const password = "senha123";
        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            console.log(`Usuário com email ${email} já existe.`);
            return;
        }
        // Hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Cria o novo usuário
        const newUser = await prisma.user.create({
            data: {
                name: "Usuário de Teste",
                email,
                password: hashedPassword,
                role: "USER",
            },
        });
        console.log("Usuário criado com sucesso:");
        console.log({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
    }
    catch (error) {
        console.error("Erro ao criar usuário de teste:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
createTestUser();
//# sourceMappingURL=createTestUser.js.map