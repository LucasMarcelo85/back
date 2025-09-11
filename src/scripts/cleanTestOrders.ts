import prisma from "../utils/prisma.js";

async function cleanTestOrders() {
  // Buscar IDs de usuários de teste
  const testUsers = await prisma.user.findMany({
    where: {
      name: { contains: "teste", mode: "insensitive" },
    },
    select: { id: true },
  });
  const testUserIds = testUsers.map((u) => u.id);

  // Montar condições
  const orConditions: any[] = [
    { orderNumber: { contains: "teste", mode: "insensitive" } },
    { notes: { contains: "teste", mode: "insensitive" } },
  ];
  if (testUserIds.length > 0) {
    orConditions.push({ userId: { in: testUserIds } });
  }

  // Remover pedidos de teste
  const deleted = await prisma.order.deleteMany({
    where: {
      OR: orConditions,
    },
  });
  console.log(`Pedidos de teste removidos: ${deleted.count}`);
}

cleanTestOrders()
  .then(() => {
    console.log("Limpeza concluída.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erro ao limpar pedidos de teste:", err);
    process.exit(1);
  });
