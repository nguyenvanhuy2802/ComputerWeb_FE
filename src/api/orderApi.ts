import { axiosInstance } from './axiosInstance';
import {Order, OrderDTO, OrderStatus} from "../types/Order";
import orderListPage from "../admin/pages/oders/OrderListPage"; // đường dẫn tuỳ theo cấu trúc dự án của bạn


const BASE_URL = '/orders';

export const getAllOrders = async (): Promise<Order[]> => {
    const res = await axiosInstance.get(BASE_URL);
    return res.data;
};

export const getOrderById = async (orderId: number): Promise<OrderDTO> => {
    const res = await axiosInstance.get(`${BASE_URL}/${orderId}`);
    return res.data;
};

export const getOrdersByStatus = async (status: OrderStatus): Promise<OrderDTO[]> => {
    const res = await axiosInstance.get(`${BASE_URL}/status/${status}`);
    return res.data;
};

export const getOrdersByCustomerId = async (customerId: number): Promise<OrderDTO[]> => {
    const res = await axiosInstance.get(`${BASE_URL}/customer/${customerId}`);
    return res.data;
};

export const createOrder = async (order: OrderDTO): Promise<OrderDTO> => {
    const res = await axiosInstance.post(BASE_URL, order);
    return res.data;
};

export const updateOrderStatus = async (
    orderId: number,
    status: OrderStatus
): Promise<OrderDTO> => {
    const res = await axiosInstance.put(`${BASE_URL}/${orderId}/status`, null, {
        params: { status },
    });
    return res.data;
};

export const deleteOrder = async (orderId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${orderId}`);
};
