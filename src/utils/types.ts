// Tipos para uso na aplicação, refletindo os modelos do Prisma
export interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string | null;
}

export interface ProductImage {
	id: number;
	url: string;
	alt?: string | null;
	order: number;
}

export interface ProductResponse {
	id: number;
	name: string;
	slug: string;
	price: number;
	original_price: number | null;
	description: string | null;
	short_description: string | null;
	main_image: string;
	discount_percentage: number;
	featured: boolean;
	stock_quantity: number;
	sku: string | null;
	rating: number;
	sizes: string[] | null;
	colors: string[] | null;
	categories: Category[];
	images: ProductImage[];
}

// Interface para criação de produtos
export interface CreateProductDto {
	name: string;
	slug?: string; // opcional porque pode ser gerado automaticamente
	price: number;
	originalPrice?: number;
	description?: string;
	shortDescription?: string;
	mainImage: string;
	discountPercentage?: number;
	featured?: boolean;
	stockQuantity?: number;
	sku?: string;
	rating?: number;
	sizes?: string[];
	colors?: string[];
	categoryIds?: number[];
	images?: {
		url: string;
		alt?: string;
		order?: number;
	}[];
}

// Interface para atualização de produtos
export interface UpdateProductDto extends Partial<CreateProductDto> {
	id: number;
}
