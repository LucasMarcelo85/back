"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateTrackingNumber = exports.updateOrderPaymentMethod = exports.updateOrderNotes = exports.updateOrderStatus = exports.getOrderByNumber = exports.getOrderById = exports.getMyOrders = exports.getAllOrders = exports.createOrder = void 0;
var prisma_js_1 = require("../utils/prisma.js");
// Função utilitária para gerar um número de pedido único
var generateOrderNumber = function () {
    // Formato: LOJA-ANO-MÊS-NÚMERO_ALEATÓRIO
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var randomNum = Math.floor(1000 + Math.random() * 9000); // Número entre 1000 e 9999
    return "LOJA-".concat(year, "-").concat(month, "-").concat(randomNum);
};
// Criar um novo pedido (versão atualizada com número de pedido)
var createOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, total_1, paymentMethod_1, shippingAddress_1, shippingMethod_1, shippingCost_1, items_1, userId_1, orderNumber_1, order, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, total_1 = _a.total, paymentMethod_1 = _a.paymentMethod, shippingAddress_1 = _a.shippingAddress, shippingMethod_1 = _a.shippingMethod, shippingCost_1 = _a.shippingCost, items_1 = _a.items;
                userId_1 = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId_1) {
                    return [2 /*return*/, res.status(401).json({ message: "Usuário não autenticado" })];
                }
                // Verificar se itens existem
                if (!items_1 || !Array.isArray(items_1) || items_1.length === 0) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "O pedido deve conter pelo menos um item" })];
                }
                orderNumber_1 = generateOrderNumber();
                return [4 /*yield*/, prisma_js_1.default.$transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var newOrder, _i, items_2, item;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tx.order.create({
                                        data: {
                                            userId: userId_1,
                                            orderNumber: orderNumber_1, // Adicionado número único de pedido
                                            total: total_1,
                                            paymentMethod: paymentMethod_1,
                                            shippingAddress: shippingAddress_1,
                                            shippingMethod: shippingMethod_1,
                                            shippingCost: shippingCost_1,
                                            status: "Em processamento", // <-- status inicial padronizado
                                        },
                                    })];
                                case 1:
                                    newOrder = _a.sent();
                                    _i = 0, items_2 = items_1;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < items_2.length)) return [3 /*break*/, 5];
                                    item = items_2[_i];
                                    return [4 /*yield*/, tx.orderItem.create({
                                            data: {
                                                orderId: newOrder.id,
                                                productId: item.productId,
                                                quantity: item.quantity,
                                                price: item.price,
                                                name: item.name,
                                                sku: item.sku || null,
                                            },
                                        })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 5: return [2 /*return*/, newOrder];
                            }
                        });
                    }); })];
            case 1:
                order = _c.sent();
                res.status(201).json({
                    message: "Pedido criado com sucesso",
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error("Erro ao criar pedido:", error_1);
                res.status(500).json({ message: "Erro ao criar pedido" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createOrder = createOrder;
// Buscar todos os pedidos (admin)
var getAllOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.default.order.findMany({
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
                    })];
            case 1:
                orders = _a.sent();
                res.json(orders);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Erro ao buscar pedidos:", error_2);
                res.status(500).json({ message: "Erro ao buscar pedidos" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
// Buscar pedidos do usuário autenticado
var getMyOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, orders, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ message: "Usuário não autenticado" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findMany({
                        where: {
                            userId: userId,
                        },
                        include: {
                            items: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    })];
            case 1:
                orders = _b.sent();
                res.json(orders);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("Erro ao buscar meus pedidos:", error_3);
                res.status(500).json({ message: "Erro ao buscar meus pedidos" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMyOrders = getMyOrders;
// Buscar um pedido específico pelo ID
var getOrderById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, isAdmin, order, error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "ADMIN";
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ message: "Usuário não autenticado" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findUnique({
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
                    })];
            case 1:
                order = _c.sent();
                if (!order) {
                    return [2 /*return*/, res.status(404).json({ message: "Pedido não encontrado" })];
                }
                // Verificar se o pedido pertence ao usuário ou se é um admin
                if (!isAdmin && order.userId !== userId) {
                    return [2 /*return*/, res.status(403).json({ message: "Acesso não autorizado" })];
                }
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _c.sent();
                console.error("Erro ao buscar pedido:", error_4);
                res.status(500).json({ message: "Erro ao buscar pedido" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOrderById = getOrderById;
// Buscar um pedido pelo número de pedido
var getOrderByNumber = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderNumber, userId, isAdmin, order, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                orderNumber = req.params.orderNumber;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "ADMIN";
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ message: "Usuário não autenticado" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findUnique({
                        where: {
                            orderNumber: orderNumber,
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
                    })];
            case 1:
                order = _c.sent();
                if (!order) {
                    return [2 /*return*/, res.status(404).json({ message: "Pedido não encontrado" })];
                }
                // Verificar se o pedido pertence ao usuário ou se é um admin
                if (!isAdmin && order.userId !== userId) {
                    return [2 /*return*/, res.status(403).json({ message: "Acesso não autorizado" })];
                }
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _c.sent();
                console.error("Erro ao buscar pedido:", error_5);
                res.status(500).json({ message: "Erro ao buscar pedido" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOrderByNumber = getOrderByNumber;
// Atualizar o status de um pedido (admin)
var updateOrderStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, status_1, paymentId, validStatus, existingOrder, updateData, updatedOrder, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                _a = req.body, status_1 = _a.status, paymentId = _a.paymentId;
                // Validação manual do ID como número
                if (!/^\d+$/.test(id)) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "ID inválido: deve ser um número" })];
                }
                validStatus = ["Em processamento", "Pago", "Cancelado"];
                if (!validStatus.includes(status_1)) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Status inválido",
                            validStatus: validStatus,
                        })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                    })];
            case 1:
                existingOrder = _b.sent();
                if (!existingOrder) {
                    return [2 /*return*/, res.status(404).json({ message: "Pedido não encontrado" })];
                }
                updateData = { status: status_1 };
                // Adicionar paymentId se fornecido
                if (paymentId) {
                    updateData.paymentId = paymentId;
                }
                // Se o status for "Pago", adicionar data de finalização
                if (status_1 === "Pago" && existingOrder.status !== "Pago") {
                    updateData.completedAt = new Date();
                }
                // Se o status for "Cancelado", definir completedAt como null
                if (status_1 === "Cancelado") {
                    updateData.completedAt = null;
                }
                return [4 /*yield*/, prisma_js_1.default.order.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: updateData,
                    })];
            case 2:
                updatedOrder = _b.sent();
                res.json({
                    message: "Status do pedido atualizado com sucesso",
                    order: updatedOrder,
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.error("Erro ao atualizar status do pedido:", error_6);
                res.status(500).json({ message: "Erro ao atualizar status do pedido" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateOrderStatus = updateOrderStatus;
// Atualizar observações de um pedido
var updateOrderNotes = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, notes, existingOrder, updatedOrder, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                notes = req.body.notes;
                // Validação manual do ID como número
                if (!/^\d+$/.test(id)) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "ID inválido: deve ser um número" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                    })];
            case 1:
                existingOrder = _a.sent();
                if (!existingOrder) {
                    return [2 /*return*/, res.status(404).json({ message: "Pedido não encontrado" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: {
                            notes: notes,
                        },
                    })];
            case 2:
                updatedOrder = _a.sent();
                res.json({
                    message: "Observações do pedido atualizadas com sucesso",
                    order: updatedOrder,
                });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error("Erro ao atualizar observações do pedido:", error_7);
                res
                    .status(500)
                    .json({ message: "Erro ao atualizar observações do pedido" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateOrderNotes = updateOrderNotes;
// Atualizar método de pagamento de um pedido
var updateOrderPaymentMethod = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, paymentMethod, paymentId, validPaymentMethods, existingOrder, updatedOrder, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                _a = req.body, paymentMethod = _a.paymentMethod, paymentId = _a.paymentId;
                // Validação manual do ID como número
                if (!/^\d+$/.test(id)) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "ID inválido: deve ser um número" })];
                }
                validPaymentMethods = [
                    "PIX",
                    "Cartão de Crédito",
                    "Boleto",
                    "Transferência",
                    "Dinheiro",
                ];
                if (!validPaymentMethods.includes(paymentMethod)) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Método de pagamento inválido",
                            validPaymentMethods: validPaymentMethods,
                        })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                    })];
            case 1:
                existingOrder = _b.sent();
                if (!existingOrder) {
                    return [2 /*return*/, res.status(404).json({ message: "Pedido não encontrado" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: {
                            paymentMethod: paymentMethod,
                            paymentId: paymentId || null,
                        },
                    })];
            case 2:
                updatedOrder = _b.sent();
                res.json({
                    message: "Método de pagamento atualizado com sucesso",
                    order: updatedOrder,
                });
                return [3 /*break*/, 4];
            case 3:
                error_8 = _b.sent();
                console.error("Erro ao atualizar método de pagamento:", error_8);
                res.status(500).json({ message: "Erro ao atualizar método de pagamento" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateOrderPaymentMethod = updateOrderPaymentMethod;
// Atualizar número de rastreamento de um pedido
var updateTrackingNumber = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, trackingNumber, existingOrder, updatedOrder, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                trackingNumber = req.body.trackingNumber;
                // Validação manual do ID como número
                if (!/^\d+$/.test(id)) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "ID inválido: deve ser um número" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                    })];
            case 1:
                existingOrder = _a.sent();
                if (!existingOrder) {
                    return [2 /*return*/, res.status(404).json({ message: "Pedido não encontrado" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: {
                            trackingNumber: trackingNumber,
                        },
                    })];
            case 2:
                updatedOrder = _a.sent();
                res.json({
                    message: "Número de rastreamento atualizado com sucesso",
                    order: updatedOrder,
                });
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                console.error("Erro ao atualizar número de rastreamento:", error_9);
                res
                    .status(500)
                    .json({ message: "Erro ao atualizar número de rastreamento" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateTrackingNumber = updateTrackingNumber;
// Cancelar um pedido pelo cliente
var cancelOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, isAdmin, existingOrder, allowedStatuses, updatedOrder, error_10;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = req.params.id;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "ADMIN";
                // Validação manual do ID como número
                if (!/^\d+$/.test(id)) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "ID inválido: deve ser um número" })];
                }
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ message: "Usuário não autenticado" })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                    })];
            case 1:
                existingOrder = _c.sent();
                if (!existingOrder) {
                    return [2 /*return*/, res.status(404).json({ message: "Pedido não encontrado" })];
                }
                // Verificar se o pedido pertence ao usuário ou se é um admin
                if (!isAdmin && existingOrder.userId !== userId) {
                    return [2 /*return*/, res.status(403).json({ message: "Acesso não autorizado" })];
                }
                allowedStatuses = ["Em processamento", "Pago"];
                if (!allowedStatuses.includes(existingOrder.status) && !isAdmin) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Este pedido não pode ser cancelado no status atual",
                            currentStatus: existingOrder.status,
                        })];
                }
                return [4 /*yield*/, prisma_js_1.default.order.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: {
                            status: "Cancelado",
                            completedAt: null,
                            notes: existingOrder.notes
                                ? "".concat(existingOrder.notes, "\n[").concat(new Date().toISOString(), "] Pedido cancelado ").concat(isAdmin ? "pelo administrador" : "pelo cliente", ".")
                                : "[".concat(new Date().toISOString(), "] Pedido cancelado ").concat(isAdmin ? "pelo administrador" : "pelo cliente", "."),
                        },
                    })];
            case 2:
                updatedOrder = _c.sent();
                res.json({
                    message: "Pedido cancelado com sucesso",
                    order: updatedOrder,
                });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _c.sent();
                console.error("Erro ao cancelar pedido:", error_10);
                res.status(500).json({ message: "Erro ao cancelar pedido" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.cancelOrder = cancelOrder;
