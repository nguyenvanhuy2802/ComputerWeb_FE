export interface OrderItem {
    orderItemId: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}

export interface CreateOrderItemRequest {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}
