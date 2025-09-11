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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategoryById = exports.getCategories = void 0;
var helpers_js_1 = require("../utils/helpers.js");
var prisma_js_1 = require("../utils/prisma.js");
// GET /api/categories - Recupera todas as categorias
var getCategories = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.default.category.findMany({
                        orderBy: { name: "asc" },
                    })];
            case 1:
                categories = _a.sent();
                res.json(categories);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Erro ao buscar categorias:", error_1);
                res.status(500).json({ message: "Erro ao buscar categorias" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCategories = getCategories;
// GET /api/categories/:id - Recupera uma categoria pelo ID
var getCategoryById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, category, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id, 10);
                if (Number.isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ message: "ID inválido" })];
                }
                return [4 /*yield*/, prisma_js_1.default.category.findUnique({
                        where: { id: id },
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ message: "Categoria não encontrada" })];
                }
                res.json(category);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Erro ao buscar categoria por ID:", error_2);
                res.status(500).json({ message: "Erro ao buscar categoria" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryById = getCategoryById;
// GET /api/categories/slug/:slug - Recupera uma categoria pelo slug
var getCategoryBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, category, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                slug = req.params.slug;
                return [4 /*yield*/, prisma_js_1.default.category.findUnique({
                        where: { slug: slug },
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ message: "Categoria não encontrada" })];
                }
                res.json(category);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Erro ao buscar categoria por slug:", error_3);
                res.status(500).json({ message: "Erro ao buscar categoria" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryBySlug = getCategoryBySlug;
// POST /api/categories - Cria uma nova categoria
var createCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, description, slug, existingCategory, category, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, description = _a.description;
                if (!name_1) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Nome da categoria é obrigatório" })];
                }
                slug = (0, helpers_js_1.createSlug)(name_1);
                return [4 /*yield*/, prisma_js_1.default.category.findUnique({
                        where: { slug: slug },
                    })];
            case 1:
                existingCategory = _b.sent();
                if (existingCategory) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Já existe uma categoria com este nome" })];
                }
                return [4 /*yield*/, prisma_js_1.default.category.create({
                        data: {
                            name: name_1,
                            slug: slug,
                            description: description,
                        },
                    })];
            case 2:
                category = _b.sent();
                res.status(201).json({
                    message: "Categoria criada com sucesso",
                    category: category,
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error("Erro ao criar categoria:", error_4);
                res.status(500).json({ message: "Erro ao criar categoria" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createCategory = createCategory;
// PUT /api/categories/:id - Atualiza uma categoria
var updateCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_2, description, existingCategory, updateData, slugExists, category, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = parseInt(req.params.id, 10);
                _a = req.body, name_2 = _a.name, description = _a.description;
                if (Number.isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ message: "ID inválido" })];
                }
                return [4 /*yield*/, prisma_js_1.default.category.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingCategory = _b.sent();
                if (!existingCategory) {
                    return [2 /*return*/, res.status(404).json({ message: "Categoria não encontrada" })];
                }
                updateData = {};
                if (!(name_2 && name_2 !== existingCategory.name)) return [3 /*break*/, 3];
                updateData.name = name_2;
                updateData.slug = (0, helpers_js_1.createSlug)(name_2);
                return [4 /*yield*/, prisma_js_1.default.category.findUnique({
                        where: {
                            slug: updateData.slug,
                            NOT: { id: id },
                        },
                    })];
            case 2:
                slugExists = _b.sent();
                if (slugExists) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Já existe uma categoria com este nome" })];
                }
                _b.label = 3;
            case 3:
                // Atualiza a descrição se fornecida
                if (description !== undefined) {
                    updateData.description = description;
                }
                return [4 /*yield*/, prisma_js_1.default.category.update({
                        where: { id: id },
                        data: updateData,
                    })];
            case 4:
                category = _b.sent();
                res.json({
                    message: "Categoria atualizada com sucesso",
                    category: category,
                });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _b.sent();
                console.error("Erro ao atualizar categoria:", error_5);
                res.status(500).json({ message: "Erro ao atualizar categoria" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateCategory = updateCategory;
// DELETE /api/categories/:id - Remove uma categoria
var deleteCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingCategory, productsWithCategory, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = parseInt(req.params.id, 10);
                if (Number.isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ message: "ID inválido" })];
                }
                return [4 /*yield*/, prisma_js_1.default.category.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingCategory = _a.sent();
                if (!existingCategory) {
                    return [2 /*return*/, res.status(404).json({ message: "Categoria não encontrada" })];
                }
                return [4 /*yield*/, prisma_js_1.default.productCategory.findMany({
                        where: { categoryId: id },
                    })];
            case 2:
                productsWithCategory = _a.sent();
                if (productsWithCategory.length > 0) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Não é possível remover esta categoria porque existem produtos associados a ela",
                        })];
                }
                // Remove a categoria
                return [4 /*yield*/, prisma_js_1.default.category.delete({
                        where: { id: id },
                    })];
            case 3:
                // Remove a categoria
                _a.sent();
                res.json({ message: "Categoria removida com sucesso" });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error("Erro ao remover categoria:", error_6);
                res.status(500).json({ message: "Erro ao remover categoria" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
