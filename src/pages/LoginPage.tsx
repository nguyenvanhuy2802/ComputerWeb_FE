import React from "react";
import {LoginData} from "../types/User";
import LoginForm from "../components/LoginForm";
import {login} from "../api/authApi";
import {useLocation, useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {useUser} from "../context/UserContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {updateToken} = useUser();
    const from = location.state?.from?.pathname || "/";


    const handleLogin = async (data: LoginData) => {
        try {
            const response = await login(data);

            if (response.success) {
                toast.success("Đăng nhập thành công!");
                const token = response.data;
                localStorage.setItem("token", token);
                console.log("token:", token);
                localStorage.setItem("username", data.username);
                updateToken(token);
                navigate(from, {replace: true});
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Sai tài khoản hoặc mật khẩu");
            } else {
                toast.error("Lỗi khi đăng nhập: " + error.message);
            }
        }
    };
    return (
        <>
            <Header/>
            <LoginForm onLogin={handleLogin}/>
            <ToastContainer position="top-right" autoClose={3000}/>
            <Footer/>
        </>

    );
}
export default LoginPage;