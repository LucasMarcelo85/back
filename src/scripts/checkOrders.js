import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`Total de pedidos: ${orders.length}`);

    orders.forEach((order) => {
      console.log(`\n------------------------------`);
      console.log(`Pedido #${order.id}`);
      console.log(`Status: ${order.status}`);
      console.log(`Cliente: ${order.user.name} (${order.user.email})`);
      console.log(`Total: R$ ${order.total}`);
      console.log(`Método de pagamento: ${order.paymentMethod}`);
      console.log(`ID do pagamento: ${order.paymentId || "N/A"}`);
      console.log(`\nItens:`);
      order.items.forEach((item) => {
        console.log(`- ${item.quantity}x ${item.name} (R$ ${item.price} cada)`);
      });
      console.log(`------------------------------`);
    });
  } catch (error) {
    console.error("Erro ao verificar pedidos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();
