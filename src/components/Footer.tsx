import React from "react";
import "../css/footer.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-col">
                    <h4>Hỗ trợ khách hàng</h4>
                    <ul>
                        <li>Hướng dẫn mua online</li>
                        <li>Ưu đãi cho doanh nghiệp</li>
                        <li>Chính sách bảo hành</li>
                        <li>Đổi trả & hoàn tiền</li>
                        <li>Dịch vụ kỹ thuật</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Chính sách</h4>
                    <ul>
                        <li>Điều kiện sử dụng</li>
                        <li>Giao hàng & lắp đặt</li>
                        <li>Chính sách trả góp</li>
                        <li>Bảo mật thông tin</li>
                        <li>Cam kết chất lượng</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Cộng đồng</h4>
                    <ul>
                        <li>Facebook</li>
                        <li>YouTube</li>
                        <li>Zalo OA</li>
                        <li>Fan Group</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Liên hệ</h4>
                    <ul>
                        <li>Email: hotro@abc.vn</li>
                        <li>Hotline: 19001234</li>
                        <li>Địa chỉ: 123 Trần ABC, TP.HCM</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 Công ty ABC - All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
