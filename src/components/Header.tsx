import React from "react";
import "../css/header.css";
import { FaSearch, FaUser, FaBell, FaShoppingCart, FaBars } from "react-icons/fa";

const Header: React.FC = () => {
    return (
        <div className="header-wrapper">
            <header>
                <div className="top-bar">
                    <div className="container top-bar-links">
                        <a href="#">Hệ thống Showroom</a>
                        <a href="#">Dành Cho Doanh Nghiệp</a>
                        <a href="#">Apple Education</a>
                        <a href="#">Hotline: 18006867</a>
                        <a href="#">Tin công nghệ</a>
                        <a href="#">Xây dựng cấu hình</a>
                        <a href="#">Khuyến mãi</a>
                    </div>
                </div>

                <div className="main-header">
                    <div className="container">
                        <div className="logo">
                            <img src="/logo.png" alt="Logo" />
                        </div>

                        <div className="menu-icon">
                            <FaBars />
                        </div>

                        <button className="category-button">Danh mục sản phẩm</button>

                        <div className="search-bar">
                            <input type="text" placeholder="Nhập từ khóa cần tìm" />
                            <button><FaSearch /></button>
                        </div>

                        <div className="header-actions">
                            <div className="login-section">
                                <FaUser/>
                                <div>
                                    <div ><a className="sub-link-b" href={"/"}> Đăng nhập</a></div>
                                    <a className="sub-link" href={"/register"}> Đăng ký</a></div>
                        </div>
                        <div className="notification">
                                <FaBell />
                            </div>
                            <div className="cart">
                                <FaShoppingCart />
                                <div>
                                    <div>Giỏ hàng của bạn</div>
                                    <div className="sub-link">(0) sản phẩm</div>
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
