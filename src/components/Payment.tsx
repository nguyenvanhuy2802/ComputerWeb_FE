import {useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getUserById } from "../api/userApi";
import { createOrder } from "../api/orderApi";
import { createOrderItem } from "../api/orderItemApi";
import {toast} from "react-toastify";
import "../css/payment.css";
import {deleteCartItem} from "../api/cartItemApi";
import {createPayment} from "../api/paymentApi";


type PaymentMethod =
    | "CASH_ON_DELIVERY"
    | "BANK_TRANSFER"
    | "QR_PAYMENT"
    | "BANK_CARD"
    | "E_WALLET";

const Payment: React.FC = () => {
    const location = useLocation();
    const { cartItems, many=true } = location.state || {};
    const { userId } = useUser();
    const [user, setUser] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userId !== null) {
                try {
                    const userData = await getUserById(userId);
                    setUser(userData);
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                }
            }
        };
        fetchUserInfo();
    }, [userId]);

    const totalAmount = cartItems?.reduce((total: number, item: any) => {
        return total + item.product.price * item.quantity;
    }, 0);


    const handlePayment = async () => {
        try {
            if (!user || !cartItems || cartItems.length === 0) {
                console.log("Thông tin không đầy đủ để thanh toán!");
                return;
            }
            const newOrder = {
                customerId: user.userId,
                buyerName: user.name,
                deliveryAddress: user.address,
                totalAmount: totalAmount,
            };

            const createdOrder = await createOrder(newOrder);
            for (const item of cartItems) {
                const newOrderItem = {
                    orderId: createdOrder.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                };

                await createOrderItem(newOrderItem);
                if(many === true) {
                    await deleteCartItem(item.cartItemId);
                }
            }
            const payment = {
                orderId: createdOrder.orderId,
                amount: totalAmount,
                paymentMethod: paymentMethod,
                status: "PENDING",
            }
            await createPayment(payment);

            toast.success("Đặt hàng thành công!");
            navigate("/orders");

        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán:", error);
            toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
        }
    };


    return (
        <div className="container payment-wrapper">
        <div className="container py-5">
            <h2 className="mb-4 text-center">Thanh Toán</h2>

            {/* Sản phẩm */}
            <div className="mb-4">
                <h4 className="mb-3">Sản phẩm</h4>
                {cartItems?.map((item: any) => (
                    <div key={item.product.productId} className="card mb-3 shadow-sm">
                        <div className="row g-0 align-items-center">
                            <div className="col-md-2">
                                <img
                                    src={item.product?.productImage}
                                    alt={item.product?.name}
                                    className="img-fluid rounded-start"
                                />
                            </div>
                            <div className="col-md-10">
                                <div className="card-body">
                                    <h5 className="card-title">{item.product?.name}</h5>
                                    <p className="card-text mb-1">Số lượng: {item.quantity}</p>
                                    <p className="card-text">
                                        Giá:{" "}
                                        <strong className="text-danger">
                                            {item.product?.price.toLocaleString()}₫
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="text-end mt-3">
                    <h5>
                        Tổng thanh toán:{" "}
                        <span className="text-danger">
            {totalAmount?.toLocaleString()}₫
        </span>
                    </h5>
                </div>

            </div>

            {/* Thông tin người dùng */}
            <div className="mb-4">
                <h4 className="mb-3">Thông tin người dùng</h4>
                {user ? (
                    <div className="card p-3 shadow-sm">
                        <div className="mb-2">
                            <label className="form-label"><strong>Tên:</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label"><strong>Email:</strong></label>
                            <input
                                type="email"
                                className="form-control"
                                value={user.email}
                                readOnly
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label"><strong>Điện thoại:</strong></label>
                            <input
                                type="tel"
                                className="form-control"
                                value={user.phone}
                                readOnly
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label"><strong>Địa chỉ:</strong></label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={user.address}
                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                            />
                        </div>
                    </div>
                ) : (
                    <p>Đang tải thông tin người dùng...</p>
                )}
            </div>


            {/* Phương thức thanh toán */}
            <div className="mb-4">
                <h4 className="mb-3">Phương thức thanh toán</h4>
                <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                    <option value="CASH_ON_DELIVERY">Thanh toán khi nhận hàng</option>
                    <option value="BANK_TRANSFER">Chuyển khoản</option>
                    <option value="QR_PAYMENT">Quét mã QR</option>
                    <option value="BANK_CARD">Thẻ ngân hàng</option>
                    <option value="E_WALLET">Ví điện tử</option>
                </select>
            </div>

            {/* Nút thanh toán */}
            <div className="text-end">
                <button className="btn btn-outline-danger btn-lg me-2"
                                onClick={() => navigate(-1)}
                >
                    Hủy
                </button>
                <button className="btn btn-primary btn-lg" onClick={handlePayment}>
                    Xác nhận thanh toán
                </button>

            </div>
        </div>
        </div>
    );
};

export default Payment;
