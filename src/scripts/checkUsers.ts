import prisma from "../utils/prisma.js";

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("Usuários encontrados:", users.length);
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
