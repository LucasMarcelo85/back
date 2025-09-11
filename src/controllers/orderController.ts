import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

// Função utilitária para gerar um número de pedido único
const generateOrderNumber = (): string => {
  // Formato: LOJA-ANO-MÊS-NÚMERO_ALEATÓRIO
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Número entre 1000 e 9999

  return `LOJA-${year}-${month}-${randomNum}`;
};

// Criar um novo pedido (versão atualizada com número de pedido)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      total,
      paymentMethod,
      shippingAddress,
      shippingMethod,
      shippingCost,
      items,
    } = req.body;

    // Obter o ID do usuário autenticado
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se itens existem
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "O pedido deve conter pelo menos um item" });
    }

    // Gerar número único de pedido
    const orderNumber = generateOrderNumber();

    // Criar o pedido com os itens em uma transação
    const order = await prisma.$transaction(async (tx) => {
      // Criar o pedido
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber, // Adicionado número único de pedido
          total,
          paymentMethod,
          shippingAddress,
          shippingMethod,
          shippingCost,
          status: "Em processamento", // <-- status inicial padronizado
        },
      });

      // Criar os itens do pedido
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            sku: item.sku || null,
          },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      message: "Pedido criado com sucesso",
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
};

// Buscar todos os pedidos (admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

// Buscar pedidos do usuário autenticado
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar meus pedidos:", error);
    res.status(500).json({ message: "Erro ao buscar meus pedidos" });
  }
};

// Buscar um pedido específico pelo ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
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

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Verificar se o pedido pertence ao usuário ou se é um admin
    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ message: "Erro ao buscar pedido" });
  }
};

// Buscar um pedido pelo número de pedido
export const getOrderByNumber = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
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

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Verificar se o pedido pertence ao usuário ou se é um admin
    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ message: "Erro ao buscar pedido" });
  }
};

// Atualizar o status de um pedido (admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentId } = req.body;

    // Validação manual do ID como número
    if (!/^\d+$/.test(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido: deve ser um número" });
    }

    // Validar os status permitidos
    const validStatus = ["Em processamento", "Pago", "Cancelado"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Status inválido",
        validStatus,
      });
    }

    // Buscar o pedido atual
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Dados para atualização
    type UpdateData = {
      status: string;
      paymentId?: string;
      completedAt?: Date | null;
    };

    const updateData: UpdateData = { status };

    // Adicionar paymentId se fornecido
    if (paymentId) {
      updateData.paymentId = paymentId;
    }

    // Se o status for "Pago", adicionar data de finalização
    if (status === "Pago" && existingOrder.status !== "Pago") {
      updateData.completedAt = new Date();
    }

    // Se o status for "Cancelado", definir completedAt como null
    if (status === "Cancelado") {
      updateData.completedAt = null;
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    res.json({
      message: "Status do pedido atualizado com sucesso",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    res.status(500).json({ message: "Erro ao atualizar status do pedido" });
  }
};

// Atualizar observações de um pedido
export const updateOrderNotes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // Validação manual do ID como número
    if (!/^\d+$/.test(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido: deve ser um número" });
    }

    // Buscar o pedido atual
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        notes,
      },
    });

    res.json({
      message: "Observações do pedido atualizadas com sucesso",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Erro ao atualizar observações do pedido:", error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar observações do pedido" });
  }
};

// Atualizar método de pagamento de um pedido
export const updateOrderPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentId } = req.body;

    // Validação manual do ID como número
    if (!/^\d+$/.test(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido: deve ser um número" });
    }

    // Validar método de pagamento
    const validPaymentMethods = [
      "PIX",
      "Cartão de Crédito",
      "Boleto",
      "Transferência",
      "Dinheiro",
    ];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Método de pagamento inválido",
        validPaymentMethods,
      });
    }

    // Buscar o pedido atual
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        paymentMethod,
        paymentId: paymentId || null,
      },
    });

    res.json({
      message: "Método de pagamento atualizado com sucesso",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Erro ao atualizar método de pagamento:", error);
    res.status(500).json({ message: "Erro ao atualizar método de pagamento" });
  }
};

// Atualizar número de rastreamento de um pedido
export const updateTrackingNumber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.body;

    // Validação manual do ID como número
    if (!/^\d+$/.test(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido: deve ser um número" });
    }

    // Buscar o pedido atual
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        trackingNumber,
      },
    });

    res.json({
      message: "Número de rastreamento atualizado com sucesso",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Erro ao atualizar número de rastreamento:", error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar número de rastreamento" });
  }
};

// Cancelar um pedido pelo cliente
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    // Validação manual do ID como número
    if (!/^\d+$/.test(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido: deve ser um número" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Buscar o pedido atual
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Verificar se o pedido pertence ao usuário ou se é um admin
    if (!isAdmin && existingOrder.userId !== userId) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    // Verificar se o pedido pode ser cancelado (apenas em "Em processamento" ou "Pago")
    const allowedStatuses = ["Em processamento", "Pago"];
    if (!allowedStatuses.includes(existingOrder.status) && !isAdmin) {
      return res.status(400).json({
        message: "Este pedido não pode ser cancelado no status atual",
        currentStatus: existingOrder.status,
      });
    }

    // Atualizar o status do pedido para "Cancelado"
    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: "Cancelado",
        completedAt: null,
        notes: existingOrder.notes
          ? `${
              existingOrder.notes
            }\n[${new Date().toISOString()}] Pedido cancelado ${
              isAdmin ? "pelo administrador" : "pelo cliente"
            }.`
          : `[${new Date().toISOString()}] Pedido cancelado ${
              isAdmin ? "pelo administrador" : "pelo cliente"
            }.`,
      },
    });

    res.json({
      message: "Pedido cancelado com sucesso",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error);
    res.status(500).json({ message: "Erro ao cancelar pedido" });
  }
};
