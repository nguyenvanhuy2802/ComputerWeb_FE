import {LoginData, RegisterData} from "../types/User";
import {axiosInstance} from "./axiosInstance";

export const login = async (data: LoginData) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const register = async (data: RegisterData) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
};
