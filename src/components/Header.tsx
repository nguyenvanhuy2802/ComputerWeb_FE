import React, {useEffect, useState} from "react";
import "../css/header.css";
import { FaSearch, FaUser, FaBell, FaShoppingCart, FaBars } from "react-icons/fa";
import {Link} from "react-router-dom";

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("username");
        if (token) {
            setIsLoggedIn(true);
            if (storedUser) setUsername(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
    };

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
                            <img src="/logo.png" alt="Logo" />
                        </div>

                        <div className="site-menu-icon">
                            <FaBars />
                        </div>

                        <button className="site-category-button">Danh mục sản phẩm</button>

                        <div className="site-search-bar">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="Bạn cần tìm gì hôm nay?" />
                        </div>

                        <div className="site-header-actions">
                            {isLoggedIn ? (
                                <div className="site-login-section">
                                    <FaUser />
                                    <div>
                                        <div>Xin chào, <strong>{username}</strong></div>
                                        <a  className="site-sub-link-b" href={"#"} onClick={(e) => {
                                            e.preventDefault();
                                            handleLogout();
                                        }}>Đăng xuất</a>
                                    </div>
                                </div>
                            ) : (
                                <div className="site-login-section">
                                    <FaUser />
                                    <div>
                                        <div><a className="site-sub-link-b" href="/login">Đăng nhập</a></div>
                                        <a className="site-sub-link" href="/register">Đăng ký</a>
                                    </div>
                                </div>
                            )}
                            <div className="site-notification">
                                <FaBell />
                            </div>
                            <div className="site-cart">
                                <FaShoppingCart />
                                <div>
                                    <div>Giỏ hàng của bạn</div>
                                    <div className="site-sub-link">(0) sản phẩm</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
