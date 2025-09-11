"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
// Exporta uma instância única do PrismaClient
var prisma = new client_1.PrismaClient();
exports.default = prisma;
