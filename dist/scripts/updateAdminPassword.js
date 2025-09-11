import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
async function updateAdminPassword() {
    try {
        const email = "admin@lojaon.com";
        const newPassword = "Admin123";
        // Verifica se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            console.log(`Usuário com email ${email} não existe.`);
            return;
        }
        // Hash da nova senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        // Atualiza a senha do usuário
        const updatedUser = await prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        console.log("Senha do administrador atualizada com sucesso:");
        console.log(updatedUser);
    }
    catch (error) {
        console.error("Erro ao atualizar senha do administrador:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
updateAdminPassword();
//# sourceMappingURL=updateAdminPassword.js.map