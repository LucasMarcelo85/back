"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
var swagger_jsdoc_1 = require("swagger-jsdoc");
var swagger_ui_express_1 = require("swagger-ui-express");
var package_json_1 = require("../../package.json");
var version = package_json_1.default.version;
// Opções básicas do Swagger
var options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Closet Moda Fitness",
            version: version,
            description: "Documentação da API RESTful para o e-commerce Closet Moda Fitness",
            license: {
                name: "Proprietário",
            },
            contact: {
                name: "Suporte",
                email: "suporte@closetmodafitness.com.br",
            },
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "Servidor de Desenvolvimento",
            },
            {
                url: "https://backend.closetmodafitness.com",
                description: "Servidor de Produção",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};
// Especificações do Swagger
var swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// Função para configurar o Swagger na API
function setupSwagger(app) {
    // Rota para documentação da API
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "API Closet Moda Fitness - Documentação",
    }));
    // Endpoint para buscar o JSON com as especificações do Swagger
    app.get("/api-docs.json", function (_req, res) {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}
