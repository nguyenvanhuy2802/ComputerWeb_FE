import { axiosInstance } from './axiosInstance';
import {CreateOrderRequest, Order, OrderAdmin, OrderDTO, OrderStatus} from "../types/Order";
import orderListPage from "../admin/pages/oders/OrderListPage"; 


const BASE_URL = '/orders';

export const getAllOrders = async (): Promise<Order[]> => {
    const res = await axiosInstance.get(BASE_URL);
    return res.data;
};
export const getAllOrdersAdmin = async (): Promise<OrderAdmin[]> => {
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

export const createOrderAdmin = async (order: OrderDTO): Promise<OrderDTO> => {
    const res = await axiosInstance.post(BASE_URL, order);
    return res.data;
};

export const updateOrderStatus = async (
    orderId: number,
    status: OrderStatus
): Promise<OrderDTO> => {
    const res = await axiosInstance.put(`${BASE_URL}/${orderId}/status`, null, {
        params: {status},
    });
    return res.data;
};

export const deleteOrder = async (orderId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${orderId}`);
}
export const createOrder = async ( data: CreateOrderRequest) => {
    const response = await axiosInstance.post("/orders", data);
    return response.data;
};

export const getOrdersByCustomerId = async (customerId: number | null) => {
    const response = await axiosInstance.get(`/orders/customer/${customerId}`);
    return response.data;

};
