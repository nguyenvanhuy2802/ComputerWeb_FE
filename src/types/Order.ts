export interface Order {
    orderId: number;
    customerId: number;
    buyerName: string;
    deliveryAddress: string;
    orderDate: string;
    status: string;
    totalAmount: number;
}
export interface CreateOrderRequest {
    customerId: number;
    buyerName: string;
    deliveryAddress: string;
    totalAmount: number;
    email?: string;
    phone?: string;


}
