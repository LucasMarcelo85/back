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
exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProductById = exports.getFeaturedProducts = exports.getProducts = void 0;
var helpers_js_1 = require("../utils/helpers.js");
var prisma_js_1 = require("../utils/prisma.js");
// GET /api/products - Recupera todos os produtos
var getProducts = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, formattedProducts, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.default.product.findMany({
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                            images: true,
                        },
                    })];
            case 1:
                products = _a.sent();
                formattedProducts = products.map(function (product) { return ({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    original_price: product.originalPrice
                        ? Number(product.originalPrice)
                        : null,
                    description: product.description,
                    short_description: product.shortDescription,
                    main_image: product.mainImage,
                    discount_percentage: product.discountPercentage,
                    featured: product.featured,
                    stock_quantity: product.stockQuantity,
                    sku: product.sku,
                    rating: Number(product.rating),
                    sizes: product.sizes ? (0, helpers_js_1.safeJsonParse)(product.sizes.toString()) : null,
                    colors: product.colors ? (0, helpers_js_1.safeJsonParse)(product.colors.toString()) : null,
                    categories: product.categories.map(function (pc) { return ({
                        id: pc.category.id,
                        name: pc.category.name,
                        slug: pc.category.slug,
                    }); }),
                    images: product.images.map(function (img) { return ({
                        id: img.id,
                        url: img.url,
                        alt: img.alt || product.name,
                    }); }),
                }); });
                res.json(formattedProducts);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Erro ao buscar produtos:", error_1);
                res.status(500).json({ message: "Erro ao buscar produtos" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProducts = getProducts;
// GET /api/products/featured - Recupera produtos em destaque
var getFeaturedProducts = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, formattedProducts, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_js_1.default.product.findMany({
                        where: {
                            featured: true,
                        },
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                            images: true,
                        },
                    })];
            case 1:
                products = _a.sent();
                formattedProducts = products.map(function (product) { return ({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    original_price: product.originalPrice
                        ? Number(product.originalPrice)
                        : null,
                    description: product.description,
                    short_description: product.shortDescription,
                    main_image: product.mainImage,
                    discount_percentage: product.discountPercentage,
                    featured: product.featured,
                    stock_quantity: product.stockQuantity,
                    sku: product.sku,
                    rating: Number(product.rating),
                    sizes: product.sizes ? (0, helpers_js_1.safeJsonParse)(product.sizes.toString()) : null,
                    colors: product.colors ? (0, helpers_js_1.safeJsonParse)(product.colors.toString()) : null,
                    categories: product.categories.map(function (pc) { return ({
                        id: pc.category.id,
                        name: pc.category.name,
                        slug: pc.category.slug,
                    }); }),
                    images: product.images.map(function (img) { return ({
                        id: img.id,
                        url: img.url,
                        alt: img.alt || product.name,
                    }); }),
                }); });
                res.json(formattedProducts);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Erro ao buscar produtos em destaque:", error_2);
                res.status(500).json({ message: "Erro ao buscar produtos em destaque" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFeaturedProducts = getFeaturedProducts;
// GET /api/products/id/:id - Recupera um produto pelo ID
var getProductById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product_1, formattedProduct, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id, 10);
                if (Number.isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ message: "ID inválido" })];
                }
                return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                        where: { id: id },
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                            images: true,
                        },
                    })];
            case 1:
                product_1 = _a.sent();
                if (!product_1) {
                    return [2 /*return*/, res.status(404).json({ message: "Produto não encontrado" })];
                }
                formattedProduct = {
                    id: product_1.id,
                    name: product_1.name,
                    slug: product_1.slug,
                    price: Number(product_1.price),
                    original_price: product_1.originalPrice
                        ? Number(product_1.originalPrice)
                        : null,
                    description: product_1.description,
                    short_description: product_1.shortDescription,
                    main_image: product_1.mainImage,
                    discount_percentage: product_1.discountPercentage,
                    featured: product_1.featured,
                    stock_quantity: product_1.stockQuantity,
                    sku: product_1.sku,
                    rating: Number(product_1.rating),
                    sizes: product_1.sizes ? (0, helpers_js_1.safeJsonParse)(product_1.sizes.toString()) : null,
                    colors: product_1.colors ? (0, helpers_js_1.safeJsonParse)(product_1.colors.toString()) : null,
                    categories: product_1.categories.map(function (pc) { return ({
                        id: pc.category.id,
                        name: pc.category.name,
                        slug: pc.category.slug,
                    }); }),
                    images: product_1.images.map(function (img) { return ({
                        id: img.id,
                        url: img.url,
                        alt: img.alt || product_1.name,
                    }); }),
                };
                res.json(formattedProduct);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Erro ao buscar produto por ID:", error_3);
                res.status(500).json({ message: "Erro ao buscar produto" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProductById = getProductById;
// GET /api/products/slug/:slug - Recupera um produto pelo slug
var getProductBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, product_2, formattedProduct, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                slug = req.params.slug;
                return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                        where: { slug: slug },
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                            images: true,
                        },
                    })];
            case 1:
                product_2 = _a.sent();
                if (!product_2) {
                    return [2 /*return*/, res.status(404).json({ message: "Produto não encontrado" })];
                }
                formattedProduct = {
                    id: product_2.id,
                    name: product_2.name,
                    slug: product_2.slug,
                    price: Number(product_2.price),
                    original_price: product_2.originalPrice
                        ? Number(product_2.originalPrice)
                        : null,
                    description: product_2.description,
                    short_description: product_2.shortDescription,
                    main_image: product_2.mainImage,
                    discount_percentage: product_2.discountPercentage,
                    featured: product_2.featured,
                    stock_quantity: product_2.stockQuantity,
                    sku: product_2.sku,
                    rating: Number(product_2.rating),
                    sizes: product_2.sizes ? (0, helpers_js_1.safeJsonParse)(product_2.sizes.toString()) : null,
                    colors: product_2.colors ? (0, helpers_js_1.safeJsonParse)(product_2.colors.toString()) : null,
                    categories: product_2.categories.map(function (pc) { return ({
                        id: pc.category.id,
                        name: pc.category.name,
                        slug: pc.category.slug,
                    }); }),
                    images: product_2.images.map(function (img) { return ({
                        id: img.id,
                        url: img.url,
                        alt: img.alt || product_2.name,
                    }); }),
                };
                res.json(formattedProduct);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Erro ao buscar produto por slug:", error_4);
                res.status(500).json({ message: "Erro ao buscar produto" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProductBySlug = getProductBySlug;
// POST /api/products - Cria um novo produto
var createProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productData, slug, existingProduct, product_3, createdProduct, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                productData = req.body;
                // Validação básica
                if (!productData.name || !productData.price || !productData.mainImage) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Dados inválidos. Nome, preço e imagem principal são obrigatórios.",
                        })];
                }
                slug = productData.slug || (0, helpers_js_1.createSlug)(productData.name);
                return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                        where: { slug: slug },
                    })];
            case 1:
                existingProduct = _a.sent();
                if (existingProduct) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Já existe um produto com este slug." })];
                }
                return [4 /*yield*/, prisma_js_1.default.product.create({
                        data: {
                            name: productData.name,
                            slug: slug,
                            price: productData.price,
                            originalPrice: productData.originalPrice,
                            description: productData.description,
                            shortDescription: productData.shortDescription,
                            mainImage: productData.mainImage,
                            discountPercentage: productData.discountPercentage || 0,
                            featured: productData.featured || false,
                            stockQuantity: productData.stockQuantity || 0,
                            sku: productData.sku,
                            rating: productData.rating || 5.0,
                            sizes: productData.sizes
                                ? JSON.stringify(productData.sizes)
                                : undefined,
                            colors: productData.colors
                                ? JSON.stringify(productData.colors)
                                : undefined,
                        },
                    })];
            case 2:
                product_3 = _a.sent();
                if (!(productData.categoryIds && productData.categoryIds.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(productData.categoryIds.map(function (categoryId) {
                        return prisma_js_1.default.productCategory.create({
                            data: {
                                productId: product_3.id,
                                categoryId: categoryId,
                            },
                        });
                    }))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!(productData.images && productData.images.length > 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, Promise.all(productData.images.map(function (image, index) {
                        return prisma_js_1.default.productImage.create({
                            data: {
                                productId: product_3.id,
                                url: image.url,
                                alt: image.alt,
                                order: image.order || index,
                            },
                        });
                    }))];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                    where: { id: product_3.id },
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                        images: true,
                    },
                })];
            case 7:
                createdProduct = _a.sent();
                res.status(201).json({
                    message: "Produto criado com sucesso",
                    product: createdProduct,
                });
                return [3 /*break*/, 9];
            case 8:
                error_5 = _a.sent();
                console.error("Erro ao criar produto:", error_5);
                res.status(500).json({ message: "Erro ao criar produto" });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
// PUT /api/products/:id - Atualiza um produto
var updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, productData, existingProduct, slugExists, updateData, updatedProduct, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                id_1 = parseInt(req.params.id, 10);
                productData = req.body;
                if (Number.isNaN(id_1)) {
                    return [2 /*return*/, res.status(400).json({ message: "ID inválido" })];
                }
                return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                        where: { id: id_1 },
                    })];
            case 1:
                existingProduct = _a.sent();
                if (!existingProduct) {
                    return [2 /*return*/, res.status(404).json({ message: "Produto não encontrado" })];
                }
                if (!(productData.slug && productData.slug !== existingProduct.slug)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                        where: { slug: productData.slug },
                    })];
            case 2:
                slugExists = _a.sent();
                if (slugExists) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Já existe um produto com este slug." })];
                }
                _a.label = 3;
            case 3:
                updateData = {};
                if (productData.name)
                    updateData.name = productData.name;
                if (productData.slug)
                    updateData.slug = productData.slug;
                if (productData.price !== undefined)
                    updateData.price = productData.price;
                if (productData.originalPrice !== undefined)
                    updateData.originalPrice = productData.originalPrice;
                if (productData.description !== undefined)
                    updateData.description = productData.description;
                if (productData.shortDescription !== undefined)
                    updateData.shortDescription = productData.shortDescription;
                if (productData.mainImage)
                    updateData.mainImage = productData.mainImage;
                if (productData.discountPercentage !== undefined)
                    updateData.discountPercentage = productData.discountPercentage;
                if (productData.featured !== undefined)
                    updateData.featured = productData.featured;
                if (productData.stockQuantity !== undefined)
                    updateData.stockQuantity = productData.stockQuantity;
                if (productData.sku !== undefined)
                    updateData.sku = productData.sku;
                if (productData.rating !== undefined)
                    updateData.rating = productData.rating;
                if (productData.sizes !== undefined)
                    updateData.sizes = productData.sizes
                        ? JSON.stringify(productData.sizes)
                        : undefined;
                if (productData.colors !== undefined)
                    updateData.colors = productData.colors
                        ? JSON.stringify(productData.colors)
                        : undefined;
                // Atualiza o produto
                return [4 /*yield*/, prisma_js_1.default.product.update({
                        where: { id: id_1 },
                        data: updateData,
                    })];
            case 4:
                // Atualiza o produto
                _a.sent();
                if (!productData.categoryIds) return [3 /*break*/, 7];
                // Remove associações existentes
                return [4 /*yield*/, prisma_js_1.default.productCategory.deleteMany({
                        where: { productId: id_1 },
                    })];
            case 5:
                // Remove associações existentes
                _a.sent();
                if (!(productData.categoryIds.length > 0)) return [3 /*break*/, 7];
                return [4 /*yield*/, Promise.all(productData.categoryIds.map(function (categoryId) {
                        return prisma_js_1.default.productCategory.create({
                            data: {
                                productId: id_1,
                                categoryId: categoryId,
                            },
                        });
                    }))];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!productData.images) return [3 /*break*/, 10];
                // Remove imagens existentes
                return [4 /*yield*/, prisma_js_1.default.productImage.deleteMany({
                        where: { productId: id_1 },
                    })];
            case 8:
                // Remove imagens existentes
                _a.sent();
                if (!(productData.images.length > 0)) return [3 /*break*/, 10];
                return [4 /*yield*/, Promise.all(productData.images.map(function (image, index) {
                        return prisma_js_1.default.productImage.create({
                            data: {
                                productId: id_1,
                                url: image.url,
                                alt: image.alt,
                                order: image.order || index,
                            },
                        });
                    }))];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                    where: { id: id_1 },
                    include: {
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                        images: true,
                    },
                })];
            case 11:
                updatedProduct = _a.sent();
                res.json({
                    message: "Produto atualizado com sucesso",
                    product: updatedProduct,
                });
                return [3 /*break*/, 13];
            case 12:
                error_6 = _a.sent();
                console.error("Erro ao atualizar produto:", error_6);
                res.status(500).json({ message: "Erro ao atualizar produto" });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = updateProduct;
// DELETE /api/products/:id - Remove um produto
var deleteProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingProduct, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id, 10);
                if (Number.isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({ message: "ID inválido" })];
                }
                return [4 /*yield*/, prisma_js_1.default.product.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingProduct = _a.sent();
                if (!existingProduct) {
                    return [2 /*return*/, res.status(404).json({ message: "Produto não encontrado" })];
                }
                // Remove o produto (as relações serão removidas automaticamente devido ao onDelete: Cascade)
                return [4 /*yield*/, prisma_js_1.default.product.delete({
                        where: { id: id },
                    })];
            case 2:
                // Remove o produto (as relações serão removidas automaticamente devido ao onDelete: Cascade)
                _a.sent();
                res.json({ message: "Produto removido com sucesso" });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error("Erro ao remover produto:", error_7);
                res.status(500).json({ message: "Erro ao remover produto" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
// GET /api/products/category/:slug - Recupera produtos por categoria
var getProductsByCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categorySlug, category, products, formattedProducts, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                categorySlug = req.params.slug;
                return [4 /*yield*/, prisma_js_1.default.category.findUnique({
                        where: { slug: categorySlug },
                    })];
            case 1:
                category = _a.sent();
                if (!category) {
                    return [2 /*return*/, res.status(404).json({ message: "Categoria não encontrada" })];
                }
                return [4 /*yield*/, prisma_js_1.default.product.findMany({
                        where: {
                            categories: {
                                some: {
                                    categoryId: category.id,
                                },
                            },
                        },
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                            images: true,
                        },
                    })];
            case 2:
                products = _a.sent();
                formattedProducts = products.map(function (product) { return ({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    original_price: product.originalPrice
                        ? Number(product.originalPrice)
                        : null,
                    description: product.description,
                    short_description: product.shortDescription,
                    main_image: product.mainImage,
                    discount_percentage: product.discountPercentage,
                    featured: product.featured,
                    stock_quantity: product.stockQuantity,
                    sku: product.sku,
                    rating: Number(product.rating),
                    sizes: product.sizes ? (0, helpers_js_1.safeJsonParse)(product.sizes.toString()) : null,
                    colors: product.colors ? (0, helpers_js_1.safeJsonParse)(product.colors.toString()) : null,
                    categories: product.categories.map(function (pc) { return ({
                        id: pc.category.id,
                        name: pc.category.name,
                        slug: pc.category.slug,
                    }); }),
                    images: product.images.map(function (img) { return ({
                        id: img.id,
                        url: img.url,
                        alt: img.alt || product.name,
                    }); }),
                }); });
                res.json(formattedProducts);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.error("Erro ao buscar produtos por categoria:", error_8);
                res.status(500).json({ message: "Erro ao buscar produtos por categoria" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProductsByCategory = getProductsByCategory;
