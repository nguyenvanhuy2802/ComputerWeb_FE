import {axiosInstance} from "./axiosInstance";
import {CreateOrderRequest} from "../types/Order";

export const createOrder = async ( data: CreateOrderRequest) => {
    const response = await axiosInstance.post("/orders", data);
    return response.data;
};

export const getOrdersByCustomerId = async (customerId: number | null) => {
    const response = await axiosInstance.get(`/orders/customer/${customerId}`);
    return response.data;
};
