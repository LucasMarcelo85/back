import prisma from "../utils/prisma.js";
export const getDashboardStats = async (req, res) => {
    try {
        // Buscar total de produtos
        const totalProducts = await prisma.product.count();
        // Buscar total de categorias
        const totalCategories = await prisma.category.count();
        // Buscar total de usuários
        const totalUsers = await prisma.user.count();
        // Buscar total de pedidos
        const totalOrders = await prisma.order.count();
        // Buscar totais por status
        const orderStatusCounts = await prisma.order.groupBy({
            by: ["status"],
            _count: true,
        });
        // Formatar contagens por status
        const orderStatusStats = orderStatusCounts.reduce((acc, item) => {
            acc[item.status.replace(/\s+/g, "")] = item._count;
            return acc;
        }, {});
        // Buscar total de vendas (pedidos com status "Pago")
        const paidOrders = await prisma.order.findMany({
            where: {
                status: "Pago",
            },
            select: {
                id: true,
                total: true,
                createdAt: true,
                completedAt: true,
            },
        });
        // Buscar pedidos em processamento (potencial receita)
        const processingOrders = await prisma.order.findMany({
            where: {
                status: "Em processamento",
            },
            select: {
                total: true,
            },
        });
        // Calcular receita total
        const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);
        // Calcular receita em potencial (pedidos em processamento)
        const potentialRevenue = processingOrders.reduce((sum, order) => sum + Number(order.total), 0);
        // Calcular ticket médio (se existirem pedidos pagos)
        const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
        // Buscar contagens por método de pagamento
        const paymentMethodCounts = await prisma.order.groupBy({
            by: ["paymentMethod"],
            where: {
                status: "Pago",
            },
            _count: true,
            _sum: {
                total: true,
            },
        });
        // Formatar dados de métodos de pagamento
        const paymentMethods = paymentMethodCounts.map((item) => ({
            method: item.paymentMethod,
            count: item._count,
            total: Number(item._sum.total),
        }));
        // Calcular receita dos últimos 7 dias
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentPaidOrders = paidOrders.filter((order) => new Date(order.completedAt || order.createdAt) >= oneWeekAgo);
        const recentRevenue = recentPaidOrders.reduce((sum, order) => sum + Number(order.total), 0);
        // Formatando e retornando todos os dados
        res.json({
            totalProducts,
            totalCategories,
            totalUsers,
            totalOrders,
            orderStatusStats,
            totalRevenue,
            potentialRevenue,
            recentRevenue,
            averageTicket,
            paidOrdersCount: paidOrders.length,
            paymentMethods,
        });
    }
    catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard:", error);
        res
            .status(500)
            .json({ message: "Erro ao buscar estatísticas do dashboard" });
    }
};
//# sourceMappingURL=dashboardController.js.map