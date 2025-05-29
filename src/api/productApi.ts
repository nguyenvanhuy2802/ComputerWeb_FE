import { Product } from "../types/Product";
import { axiosInstance } from "./axiosInstance";

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products");
    return response.data;
};
export const getProductById = async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data as Product;
};
