import {axiosInstance} from "./axiosInstance";

export const getCurrentUserId = async (): Promise<number> => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
};

export const getUserById = async (id: number): Promise<number> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
};
