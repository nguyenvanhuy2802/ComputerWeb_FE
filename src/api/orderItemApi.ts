import {axiosInstance} from "./axiosInstance";
import {CreateOrderItemRequest} from "../types/OrderItem";

export const createOrderItem = async (data:CreateOrderItemRequest ) => {
    const response = await axiosInstance.post("/order-items", data);
    return response.data;
};

export const getOrderItemsByOrderId = async (orderId: number ) => {
    const response = await axiosInstance.get(`/order-items/order/${orderId}`);
    return response.data;
};