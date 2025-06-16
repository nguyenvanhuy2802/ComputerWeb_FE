import { Category } from "../types/Category";
import { axiosInstance } from "./axiosInstance";

export const getAllCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/categories");
    return response.data;
};

export const getCategoryById = async (id: number) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
};
