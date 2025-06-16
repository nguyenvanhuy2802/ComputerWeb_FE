import React from 'react';
import RegisterForm from '../components/RegisterForm';
import {RegisterData} from '../types/User';
import {register} from "../api/authApi";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {saveCart} from "../api/cartApi";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";


const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterData) => {
        try {
            const response = await register(data);
            if (response.success) {
                try {
                    const userId = Number(response.data);
                    console.log(userId);
                    const res = await saveCart(userId);
                    if (res) {
                        console.log("Tạo giỏ hàng thành công!");
                        toast.success("Đăng ký thành công!");
                        toast.info(
                            <div>
                                <span>Chuyển sang trang đăng nhập</span>
                                <button
                                    style={{
                                        marginLeft: "5px",
                                        background: "#5a9ee4",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        toast.dismiss(); // tắt toast hiện tại
                                        navigate('/login'); // điều hướng
                                    }}
                                >
                                    Đăng nhập
                                </button>
                            </div>,
                            { autoClose: false }
                        );
                    } else {
                        console.log("Tạo giỏ hàng thất bại!");
                        toast.error("Đăng ký thất bại khi tạo giỏ hàng.");
                    }
                } catch (error) {
                    console.error("Lỗi khi tạo giỏ hàng:", error);
                    toast.error("Đăng ký thành công nhưng tạo giỏ hàng thất bại.");
                }
            } else {
                toast.error(`Đăng ký thất bại: ${response.message}`);
            }
        }catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            const backendMessage = error?.response?.data?.message;
            toast.error(`Đã xảy ra lỗi trong quá trình đăng ký: ${backendMessage || "Vui lòng thử lại sau."}`);
        } };
    return (
        <>
            <Header/>
            <RegisterForm onRegister={handleRegister}/>
            <ToastContainer position="top-right" autoClose={3000}/>
            <Footer/>
        </>

    );
};


export default RegisterPage;
