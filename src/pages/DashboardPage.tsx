// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import {axiosInstance} from "../api/axiosInstance";

export type PaymentMethod =
    | "CASH_ON_DELIVERY"
    | "BANK_TRANSFER"
    | "QR_PAYMENT"
    | "BANK_CARD"
    | "E_WALLET";

export type PaymentStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "REFUNDED";

export interface PaymentDTO {
    paymentId: number;
    orderId: number;
    paymentDate: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
}

const DashboardPage: React.FC = () => {
    const [payments, setPayments] = useState<PaymentDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingQRPayments();
    }, []);

    const fetchPendingQRPayments = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<PaymentDTO[]>("/payments/qr-pending");
            setPayments(response.data);
        } catch (err) {
            setError("Không thể tải danh sách thanh toán.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, status: PaymentStatus) => {
        try {
            const payment = payments.find(p => p.paymentId === id);
            if (!payment) return;

            const updated = { ...payment, status };

            const response = await axiosInstance.put<PaymentDTO>(`/payments/${id}`, updated);
            setPayments(prev =>
                prev.map(p => (p.paymentId === id ? response.data : p))
            );
        } catch (err) {
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Quản lý thanh toán (QR + PENDING)</h2>

            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Số tiền</th>
                        <th>Ngày thanh toán</th>
                        <th>Phương thức</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((payment, index) => (
                        <tr key={payment.paymentId}>
                            <td>{index + 1}</td>
                            <td>{payment.orderId}</td>
                            <td>{payment.amount.toLocaleString("vi-VN")} ₫</td>
                            <td>{payment.paymentDate?.toString()}</td>
                            <td>{payment.paymentMethod}</td>
                            <td>
                                    <span className="badge bg-warning text-dark">
                                        {payment.status}
                                    </span>
                            </td>
                            <td>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => updateStatus(payment.paymentId!, "COMPLETED")}
                                >
                                    Đánh dấu đã thanh toán
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default DashboardPage;
