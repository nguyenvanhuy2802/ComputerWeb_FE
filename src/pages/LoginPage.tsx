import React from "react";
import {LoginData} from "../types/User";
import LoginForm from "../components/LoginForm";
import {login} from "../api/authApi";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {useUser} from "../context/UserContext";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const {updateToken} = useUser();

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
                navigate("/");
            } else {
                toast.error(`Đăng nhập thất bại: ${response.message}`);
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
            <LoginForm onLogin={handleLogin}/>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>

    );
}
export default LoginPage;