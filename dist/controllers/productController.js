import { createSlug, safeJsonParse } from "../utils/helpers.js";
import prisma from "../utils/prisma.js";
// GET /api/products - Recupera todos os produtos
export const getProducts = async (_req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                images: true,
            },
        });
        const formattedProducts = products.map((product) => ({
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
            sizes: product.sizes ? safeJsonParse(product.sizes.toString()) : null,
            colors: product.colors ? safeJsonParse(product.colors.toString()) : null,
            categories: product.categories.map((pc) => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug,
            })),
            images: product.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt || product.name,
            })),
        }));
        res.json(formattedProducts);
    }
    catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ message: "Erro ao buscar produtos" });
    }
};
// GET /api/products/featured - Recupera produtos em destaque
export const getFeaturedProducts = async (_req, res) => {
    try {
        const products = await prisma.product.findMany({
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
        });
        const formattedProducts = products.map((product) => ({
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
            sizes: product.sizes ? safeJsonParse(product.sizes.toString()) : null,
            colors: product.colors ? safeJsonParse(product.colors.toString()) : null,
            categories: product.categories.map((pc) => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug,
            })),
            images: product.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt || product.name,
            })),
        }));
        res.json(formattedProducts);
    }
    catch (error) {
        console.error("Erro ao buscar produtos em destaque:", error);
        res.status(500).json({ message: "Erro ao buscar produtos em destaque" });
    }
};
// GET /api/products/id/:id - Recupera um produto pelo ID
export const getProductById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                images: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        const formattedProduct = {
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
            sizes: product.sizes ? safeJsonParse(product.sizes.toString()) : null,
            colors: product.colors ? safeJsonParse(product.colors.toString()) : null,
            categories: product.categories.map((pc) => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug,
            })),
            images: product.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt || product.name,
            })),
        };
        res.json(formattedProduct);
    }
    catch (error) {
        console.error(`Erro ao buscar produto por ID:`, error);
        res.status(500).json({ message: "Erro ao buscar produto" });
    }
};
// GET /api/products/slug/:slug - Recupera um produto pelo slug
export const getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                images: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        const formattedProduct = {
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
            sizes: product.sizes ? safeJsonParse(product.sizes.toString()) : null,
            colors: product.colors ? safeJsonParse(product.colors.toString()) : null,
            categories: product.categories.map((pc) => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug,
            })),
            images: product.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt || product.name,
            })),
        };
        res.json(formattedProduct);
    }
    catch (error) {
        console.error(`Erro ao buscar produto por slug:`, error);
        res.status(500).json({ message: "Erro ao buscar produto" });
    }
};
// POST /api/products - Cria um novo produto
export const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        // Validação básica
        if (!productData.name || !productData.price || !productData.mainImage) {
            return res.status(400).json({
                message: "Dados inválidos. Nome, preço e imagem principal são obrigatórios.",
            });
        }
        // Gera o slug se não foi fornecido
        const slug = productData.slug || createSlug(productData.name);
        // Verifica se o slug já existe
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });
        if (existingProduct) {
            return res
                .status(400)
                .json({ message: "Já existe um produto com este slug." });
        }
        // Cria o produto no banco de dados
        const product = await prisma.product.create({
            data: {
                name: productData.name,
                slug,
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
        });
        // Associa categorias se fornecidas
        if (productData.categoryIds && productData.categoryIds.length > 0) {
            await Promise.all(productData.categoryIds.map((categoryId) => prisma.productCategory.create({
                data: {
                    productId: product.id,
                    categoryId,
                },
            })));
        }
        // Adiciona imagens se fornecidas
        if (productData.images && productData.images.length > 0) {
            await Promise.all(productData.images.map((image, index) => prisma.productImage.create({
                data: {
                    productId: product.id,
                    url: image.url,
                    alt: image.alt,
                    order: image.order || index,
                },
            })));
        }
        // Busca o produto completo para retornar
        const createdProduct = await prisma.product.findUnique({
            where: { id: product.id },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                images: true,
            },
        });
        res.status(201).json({
            message: "Produto criado com sucesso",
            product: createdProduct,
        });
    }
    catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ message: "Erro ao criar produto" });
    }
};
// PUT /api/products/:id - Atualiza um produto
export const updateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const productData = req.body;
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        // Verifica se o produto existe
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        // Se o slug está sendo alterado, verifica se já existe
        if (productData.slug && productData.slug !== existingProduct.slug) {
            const slugExists = await prisma.product.findUnique({
                where: { slug: productData.slug },
            });
            if (slugExists) {
                return res
                    .status(400)
                    .json({ message: "Já existe um produto com este slug." });
            }
        }
        // Prepara os dados para atualização
        const updateData = {};
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
        await prisma.product.update({
            where: { id },
            data: updateData,
        });
        // Atualiza categorias se fornecidas
        if (productData.categoryIds) {
            // Remove associações existentes
            await prisma.productCategory.deleteMany({
                where: { productId: id },
            });
            // Adiciona novas associações
            if (productData.categoryIds.length > 0) {
                await Promise.all(productData.categoryIds.map((categoryId) => prisma.productCategory.create({
                    data: {
                        productId: id,
                        categoryId,
                    },
                })));
            }
        }
        // Atualiza imagens se fornecidas
        if (productData.images) {
            // Remove imagens existentes
            await prisma.productImage.deleteMany({
                where: { productId: id },
            });
            // Adiciona novas imagens
            if (productData.images.length > 0) {
                await Promise.all(productData.images.map((image, index) => prisma.productImage.create({
                    data: {
                        productId: id,
                        url: image.url,
                        alt: image.alt,
                        order: image.order || index,
                    },
                })));
            }
        }
        // Busca o produto atualizado para retornar
        const updatedProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                images: true,
            },
        });
        res.json({
            message: "Produto atualizado com sucesso",
            product: updatedProduct,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ message: "Erro ao atualizar produto" });
    }
};
// DELETE /api/products/:id - Remove um produto
export const deleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        // Verifica se o produto existe
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        // Remove o produto (as relações serão removidas automaticamente devido ao onDelete: Cascade)
        await prisma.product.delete({
            where: { id },
        });
        res.json({ message: "Produto removido com sucesso" });
    }
    catch (error) {
        console.error("Erro ao remover produto:", error);
        res.status(500).json({ message: "Erro ao remover produto" });
    }
};
// GET /api/products/category/:slug - Recupera produtos por categoria
export const getProductsByCategory = async (req, res) => {
    try {
        const categorySlug = req.params.slug;
        // Busca a categoria pelo slug
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
        });
        if (!category) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }
        // Busca produtos associados a essa categoria
        const products = await prisma.product.findMany({
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
        });
        const formattedProducts = products.map((product) => ({
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
            sizes: product.sizes ? safeJsonParse(product.sizes.toString()) : null,
            colors: product.colors ? safeJsonParse(product.colors.toString()) : null,
            categories: product.categories.map((pc) => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug,
            })),
            images: product.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt || product.name,
            })),
        }));
        res.json(formattedProducts);
    }
    catch (error) {
        console.error(`Erro ao buscar produtos por categoria:`, error);
        res.status(500).json({ message: "Erro ao buscar produtos por categoria" });
    }
};
//# sourceMappingURL=productController.js.map