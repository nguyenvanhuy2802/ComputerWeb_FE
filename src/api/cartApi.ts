import { axiosInstance } from "./axiosInstance";

export const saveCart = async ( customerId:number) => {
    const response = await axiosInstance.post(`/carts/customer/${customerId}`);
    return response.data;
};

export const getCartByCustomerId = async ( customerId:number) => {
    const response = await axiosInstance.get(`/carts/customer/${customerId}`);
    return response.data;
};