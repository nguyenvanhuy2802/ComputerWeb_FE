import React, {useEffect, useState} from "react";
import "../css/header.css";
import {FaBars, FaBell, FaClipboardList, FaSearch, FaShoppingCart, FaUser} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useCart} from "../context/CartContext";
import { MdReceiptLong } from "react-icons/md";
import GoogleTranslate from "../components/GoogleTranslate";

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const {cartCount, refreshCartCount, setCartCount} = useCart();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");


    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setCartCount(0)
        setIsLoggedIn(false);
        navigate("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("username");
        if (token) {
            setIsLoggedIn(true);
            if (storedUser) setUsername(storedUser);
            refreshCartCount();
        }
    }, []);

    return (
        <div className="site-header-wrapper">
            <header className="site-header">
                <div className="site-top-bar">
                    <div className="site-container site-top-bar-links">
                        <a href="#">Hệ thống Showroom</a>
                        <a href="#">Dành Cho Doanh Nghiệp</a>
                        <a href="#">Apple Education</a>
                        <a href="#">Hotline: 18006867</a>
                        <a href="#">Tin công nghệ</a>
                        <a href="#">Xây dựng cấu hình</a>
                        <a href="#">Khuyến mãi</a>
                        <a href="#">Chính sách bảo hành</a>
                    </div>
                </div>

                <div className="site-main-header">
                    <div className="site-container">
                        <div className="site-logo">
                            <Link to="/">
                                <img src="/logo.png" alt="Logo"/>
                            </Link></div>

                        <div className="site-menu-icon">
                            <FaBars/>
                        </div>

                        <button className="site-category-button">Danh mục sản phẩm</button>

                        <div className="site-search-bar">
                            <FaSearch className="search-icon"/>
                            <input
                                type="text"
                                placeholder="Bạn cần tìm gì hôm nay?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>

                        <div className="site-header-actions">
                            {isLoggedIn ? (
                                <div className="site-login-section">
                                    <Link to="/information" className="site-sub-link-b">
                                        <FaUser style={{ marginRight: '6px' }} />
                                    </Link>
                                    <div>
                                        <div>Xin chào, <strong>{username}</strong></div>
                                        <Link
                                            to="#"
                                            className="site-sub-link-b"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleLogout();
                                            }}
                                        >
                                            Đăng xuất
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="site-login-section">
                                    <FaUser/>
                                    <div>
                                        <div><Link to="/login" className="site-sub-link-b">Đăng nhập</Link></div>
                                        <Link to="/register" className="site-sub-link">Đăng ký</Link>
                                    </div>
                                </div>
                            )}
                            <div className="site-notification">
                                <FaBell/>
                            </div>
                            <div className="site-orders-link">
                                <Link to="/orders" className="site-order-link">
                                    <MdReceiptLong style={{marginRight: "6px", fontSize: "18px", color: "#1E90FF"}}/>
                                    Đơn hàng
                                </Link>
                            </div>

                            <div className="site-cart">
                                <FaShoppingCart/>
                                <div>
                                    <div><Link to="/cart" className="site-sub-link-b">Giỏ hàng của bạn</Link></div>
                                    <div className="site-sub-link">
                                        <span className="cart-count-highlight" translate="no">({cartCount})</span> sản phẩm
                                    </div>
                                </div>
                            </div>
                            <GoogleTranslate />
                        </div>

                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
