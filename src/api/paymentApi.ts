import {axiosInstance} from "./axiosInstance";
import {Payment} from "../types/Payment";

export const createPayment = async (data:Payment ) => {
    const response = await axiosInstance.post("/payments", data);
    return response.data;
};

export const getPaymentsByOrderId = async (orderId: number ) => {
    const response = await axiosInstance.get(`/payments/order/${orderId}`);
    return response.data;
};
