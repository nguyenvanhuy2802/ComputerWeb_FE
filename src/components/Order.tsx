import React, { useEffect, useState } from "react";
import { getOrdersByCustomerId } from "../api/orderApi";
import { useUser } from "../context/UserContext";
import { getOrderItemsByOrderId } from "../api/orderItemApi";
import OrderDetailModal from "./OrderDetailModal";
import { getPaymentsByOrderId } from "../api/paymentApi";
import { Order } from "../types/Order";
import "../css/orders.css";

type OrderWithPayment = Order & {
    paymentMethod?: string;
    paymentStatus?: string;
};


const Orders: React.FC = () => {
    const { userId } = useUser();
    const [orders, setOrders] = useState<OrderWithPayment[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);


    const paymentMethodMap: Record<string, string> = {
        CASH_ON_DELIVERY: "Thanh toán khi nhận hàng",
        BANK_TRANSFER: "Chuyển khoản ngân hàng",
        QR_PAYMENT: "Thanh toán bằng mã QR",
        BANK_CARD: "Thẻ ngân hàng",
        E_WALLET: "Ví điện tử"
    };

    const paymentStatusMap: Record<string, string> = {
        PENDING: "Đang chờ thanh toán",
        COMPLETED: "Đã thanh toán",
        FAILED: "Thanh toán thất bại",
        REFUNDED: "Đã hoàn tiền"
    };


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

            setOrders(enrichedOrders);
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

            {orders.length === 0 ? (
                <div className="alert alert-info text-center">Bạn chưa có đơn hàng nào.</div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {orders.map((order) => (
                        <div className="order-card shadow-lg rounded-4 p-4 bg-white" key={order.orderId}>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                                <h5 className="mb-0 text-primary fw-bold">Mã đơn hàng: #{order.orderId}</h5>
                                <span className={`badge fs-6 px-3 py-2 rounded-pill ${
                                    order.status === "Đã giao"
                                        ? "bg-success"
                                        : order.status === "Đang xử lý"
                                            ? "bg-warning text-dark"
                                            : "bg-secondary"
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="row gy-2">
                                <div className="col-md-6">
                                    <p><strong>Người mua:</strong> {order.buyerName}</p>
                                    <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Địa chỉ:</strong> {order.deliveryAddress}</p>
                                    <p>
                                        <strong>Tổng tiền:</strong>{" "}
                                        <span className="text-danger fw-bold">
                                            {Number(order.totalAmount).toLocaleString()}₫
                                        </span>
                                    </p>
                                </div>
                                <p><strong>Phương thức thanh
                                    toán:</strong> {paymentMethodMap[order.paymentMethod ?? ""] || "Không xác định"}</p>
                                <p><strong>Trạng thái thanh
                                    toán:</strong> {paymentStatusMap[order.paymentStatus ?? ""] || "Không xác định"}</p>

                            </div>
                            <div className="text-end mt-4">
                                <button
                                    className="btn btn-outline-primary rounded-pill px-4"
                                    onClick={() => handleViewDetails(order.orderId)}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}

                    <OrderDetailModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        orderId={selectedOrderId}
                        orderItems={orderItems}
                    />
                </div>
            )}
        </div>
    );
};

export default Orders;
