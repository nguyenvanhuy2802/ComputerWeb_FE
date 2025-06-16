import {Product, ProductDTO, ProductWithRating} from "../types/Product";
import {axiosInstance} from "./axiosInstance";

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products");
    return response.data;
};

export const getProductByIdAdmin = (id: number) => axiosInstance.get<Product>(`/products/${id}`);
export const searchProducts = (keyword: string) => axiosInstance.get<Product[]>(`/products/search?keyword=${keyword}`);
export const getProductsByCategory = (categoryId: number) => axiosInstance.get<Product[]>(`/products/category/${categoryId}`);
export const getProductsByPriceRange = (minPrice: number, maxPrice: number) =>
    axiosInstance.get<Product[]>(`/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);

export const createProduct = (product: Omit<ProductDTO, "productId">) => axiosInstance.post("/products", product);
export const updateProduct = (id: number, product: Omit<ProductDTO, "productId">) => axiosInstance.put(`/products/${id}`, product);
export const deleteProduct = (id: number) => axiosInstance.delete(`/products/${id}`);
export const getProductById = async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data as Product;
};
export const searchProductWithRating = async (
    query: string,
    priceRange?: string,
    sortBy?: string
): Promise<ProductWithRating[]> => {
    const response = await axiosInstance.get<ProductWithRating[]>('/products/search-filter', {
        params: { query, priceRange, sortBy }
    });
    return response.data;
};

export const getPaginatedProducts = async (page: number, size: number = 10) => {
    const response = await axiosInstance.get(`/products/paginated?page=${page}&size=${size}`);
    return response.data;
};
