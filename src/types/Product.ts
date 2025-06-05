export interface Product{
    productId: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
    productImage: string;
}
export interface ProductDTO{
    productId?: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
    productImage: string;
}

