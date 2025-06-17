// src/pages/QrCodePage.tsx
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {generateQR, getPaymentsByOrderId} from "../api/paymentApi";
import "../css/qr.css";
import {toast} from "react-toastify";

const QrCode: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { amount, addInfo, orderId } = location.state || {};
    const [qrUrl, setQrUrl] = useState<string | null>(null);


    useEffect(() => {
        const fetchQrCode = async () => {
            try {

                const data = await generateQR({amount, addInfo});
                setQrUrl(data.qrCodeImage);
            } catch (error) {
                console.error("Lỗi khi tạo mã QR:", error);
            }
        };
        fetchQrCode();
    }, [amount, addInfo]);

    useEffect(() => {
        if (!orderId) return;

        const interval = setInterval(async () => {
            try {
                const payment = await getPaymentsByOrderId(orderId);
                const status = payment[0]?.status;

                console.log("Payment object:", payment);
                if (status === "COMPLETED") {
                    clearInterval(interval);
                    toast.success("Thanh toán thành công!");
                    navigate("/orders");

                }
            } catch (err) {
                console.error("Lỗi kiểm tra trạng thái:", err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [orderId, navigate]);

    const handleManualCheck = async () => {
        if (!orderId) {
            toast.error("Không tìm thấy mã đơn hàng ");
            return;}
        try {
            const payment = await getPaymentsByOrderId(orderId);
            const status = payment[0]?.status;

            console.log("Payment object:", payment);
            if (status === "COMPLETED") {
                toast.success("Thanh toán thành công!");
                navigate("/orders");
            } else {
                toast.info("Thanh toán chưa hoàn tất.");
            }
        } catch (err) {
            console.error("Lỗi kiểm tra trạng thái thủ công:", err);
            toast.error("Không thể kiểm tra trạng thái thanh toán.");
        }
    };

    return (
        <div className={"container-wrapper"}>
            <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 qr-page">
                <div className="text-center">
                    <h2 className="mb-4 fw-bold">Quét mã để thanh toán</h2>
                    {qrUrl ? (
                        <div className="qr-wrapper p-4 bg-white rounded-4 shadow">
                            <img src={qrUrl} alt="QR Code" className="qr-img img-fluid"/>
                        </div>
                    ) : (
                        <p className="text-secondary">Đang tạo mã QR...</p>
                    )}
                    <div className="mt-4 d-flex flex-column gap-3">
                        <button className="btn btn-lg btn-outline-success" onClick={handleManualCheck}>
                            🔄 Kiểm tra
                        </button>
                        <button className="btn btn-lg btn-outline-primary" onClick={() => navigate(-1)}>
                            ← Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default QrCode;
