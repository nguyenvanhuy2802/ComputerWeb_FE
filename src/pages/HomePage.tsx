import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/homepage.css";

const HomePage: React.FC = () => {
    return(
    <div className="layout">
        <Header />
        <main className="main-content">
            <h1>Chào mừng đến trang chủ!</h1>
            <p>Bạn đã đăng nhập thành công 🎉</p>
        </main>
        <Footer/>
    </div>
);
};

export default HomePage;
