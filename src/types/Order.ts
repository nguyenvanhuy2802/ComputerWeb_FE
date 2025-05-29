
export type OrderStatus = "PENDING" | "CONFIRMED" |"PACKAGING"| "SHIPPED" | "COMPLETED" | "CANCELED" | "RETURNED"
export interface Order {
    orderId: number;
    customerId: number;
    buyerName: string;
    deliveryAddress: string;
    orderDate: string;
    status: string;
    totalAmount: number;  
}
export interface OrderAdmin {
    orderId: number;
    customerId: number;
    buyerName: string;
    deliveryAddress: string;
    totalAmount: number;
    status: OrderStatus;
    orderDate: string;
}
export interface OrderDTO {
    orderId?: number;
    customerId: number;
    buyerName: string;
    deliveryAddress: string;
    totalAmount: number;
    status: OrderStatus;
    orderDate?: string;
}
export interface CreateOrderRequest {
    customerId: number;
    buyerName: string;
    deliveryAddress: string;
    totalAmount: number;
    email?: string;
    phone?: string;
}
