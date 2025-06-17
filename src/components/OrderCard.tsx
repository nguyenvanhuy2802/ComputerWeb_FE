import {OrderWithPayment} from "../types/Order";

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

const orderStatusMap: Record<string, string> = {
    PENDING: "Đang chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PACKAGING: "Đang đóng gói",
    SHIPPED: "Đã giao hàng",
    COMPLETED: "Hoàn tất",
    CANCELED: "Đã hủy",
    RETURNED: "Đã trả hàng"
};

const getStatusBadgeClass = (status: string): string => {
    switch (status) {
        case "COMPLETED":
            return "bg-success";
        case "SHIPPED":
            return "bg-primary";
        case "PACKAGING":
            return "bg-info text-dark";
        case "CONFIRMED":
            return "bg-secondary";
        case "PENDING":
            return "bg-warning text-dark";
        case "CANCELED":
            return "bg-danger";
        case "RETURNED":
            return "bg-dark text-white";
        default:
            return "bg-light text-dark";
    }
};

const OrderCard: React.FC<{
    order: OrderWithPayment;
    onViewDetails: (orderId: number) => void;
    onCancel: (orderId: number) => void;
}> = ({ order, onViewDetails, onCancel }) => (
    <div className="order-card shadow rounded-4 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <h5 className="mb-0 text-primary fw-bold">Mã đơn hàng: #{order.orderId}</h5>
            <span className={`badge fs-6 px-3 py-2 rounded-pill ${getStatusBadgeClass(order.status)}`}>
                {orderStatusMap[order.status] || "Không xác định"}
            </span>
        </div>
        <div className="row gy-2">
            <div className="col-md-6">
                <p translate="no"><strong>Người mua:</strong> {order.buyerName}</p>
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
            <p><strong>Trạng thái thanh toán:</strong> {paymentStatusMap[order.paymentStatus ?? ""] || "Không xác định"}
            </p>
        </div>
        <div className="text-end mt-4 d-flex justify-content-end gap-3">
            {order.status === "PENDING" && (
                <button
                    className="btn btn-outline-danger rounded-pill px-4"
                    onClick={() => onCancel(order.orderId)}
                >
                    Hủy đơn hàng
                </button>
            )}
            <button
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => onViewDetails(order.orderId)}
            >
                Xem chi tiết
            </button>
        </div>

    </div>
);

export default OrderCard;
