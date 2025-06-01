import React, { useEffect, useState } from "react";
import { getOrdersByCustomerId } from "../api/orderApi";
import { useUser } from "../context/UserContext";
import { getOrderItemsByOrderId } from "../api/orderItemApi";
import OrderDetailModal from "./OrderDetailModal";
import { getPaymentsByOrderId } from "../api/paymentApi";
import { Order } from "../types/Order";
import "../css/orders.css";
import OrderCard from "./OrderCard";

type OrderWithPayment = Order & {
    paymentMethod?: string;
    paymentStatus?: string;
};


const Orders: React.FC = () => {
    const { userId } = useUser();
    const [orders, setOrders] = useState<OrderWithPayment[]>([]);
    const [currentOrders, setCurrentOrders] = useState<OrderWithPayment[]>([]);
    const [pastOrders, setPastOrders] = useState<OrderWithPayment[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const data: Order[] = await getOrdersByCustomerId(userId);

            // Lấy thêm thông tin payment cho từng order
            const enrichedOrders = await Promise.all(
                data.map(async (order) => {
                    const payments = await getPaymentsByOrderId(order.orderId);
                    const latestPayment = payments.length > 0 ? payments[0] : null;

                    return {
                        ...order,
                        paymentMethod: latestPayment?.paymentMethod || "Không rõ",
                        paymentStatus: latestPayment?.status || "Chưa thanh toán",
                    };
                })
            );

            const current = enrichedOrders.filter(
                (order) =>
                    order.status !== "COMPLETED" &&
                    order.status !== "CANCELED" &&
                    order.status !== "RETURNED"
            );
            const past = enrichedOrders.filter(
                (order) =>
                    order.status === "COMPLETED" ||
                    order.status === "CANCELED" ||
                    order.status === "RETURNED"
            );

            setCurrentOrders(current);
            setPastOrders(past);
        };
        fetchOrders();
    }, [userId]);

    const handleViewDetails = async (orderId: number) => {
        const items = await getOrderItemsByOrderId(orderId);
        setSelectedOrderId(orderId);
        setOrderItems(items);
        setShowModal(true);
    };

    return (
        <div className="container orders-wrapper">
            <h2 className="text-center mb-5 text-uppercase fw-bold">Đơn hàng của bạn</h2>

            {currentOrders.length === 0 && pastOrders.length === 0 ? (
                <div className="alert alert-info text-center">Bạn chưa có đơn hàng nào.</div>
            ) : (
                <>
                    {currentOrders.length > 0 && (
                        <>
                            <h4 className="mb-3 text-primary">Đơn hàng hiện tại</h4>
                            <div className="d-flex flex-column gap-4 mb-5">
                                {currentOrders.map((order) => (
                                    <OrderCard key={order.orderId} order={order} onViewDetails={handleViewDetails} />
                                ))}
                            </div>
                        </>
                    )}

                    {pastOrders.length > 0 && (
                        <>
                            <h4 className="mb-3 text-secondary">Lịch sử đơn hàng</h4>
                            <div className="d-flex flex-column gap-4">
                                {pastOrders.map((order) => (
                                    <OrderCard key={order.orderId} order={order} onViewDetails={handleViewDetails} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            <OrderDetailModal
                show={showModal}
                onClose={() => setShowModal(false)}
                orderId={selectedOrderId}
                orderItems={orderItems}
            />
        </div>
    );

};

export default Orders;
