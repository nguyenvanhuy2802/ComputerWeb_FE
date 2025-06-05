export interface Payment {
    orderId: number;
    amount: number;
    paymentMethod: string;
    status: string;
}

export interface QRPayment {
    amount: number;
    addInfo: string;
}