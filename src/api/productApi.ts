import {Product, ProductDTO} from "../types/Product";
import { axiosInstance } from "./axiosInstance";

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products");
    return response.data;
};
export const getProductById = (id: number) => axiosInstance.get<Product>(`/products/${id}`);
export const searchProducts = (keyword: string) => axiosInstance.get<Product[]>(`/products/search?keyword=${keyword}`);
export const getProductsByCategory = (categoryId: number) => axiosInstance.get<Product[]>(`/products/category/${categoryId}`);
export const getProductsByPriceRange = (minPrice: number, maxPrice: number) =>
    axiosInstance.get<Product[]>(`/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);

export const createProduct = (product: Omit<ProductDTO, "productId">) => axiosInstance.post("/products", product);
export const updateProduct = (id: number, product: Omit<ProductDTO, "productId">) => axiosInstance.put(`/products/${id}`, product);
export const deleteProduct = (id: number) => axiosInstance.delete(`/products/${id}`);