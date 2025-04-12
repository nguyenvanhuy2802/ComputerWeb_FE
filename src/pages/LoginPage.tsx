import React from "react";
import {LoginData} from "../types/User";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
    const handleLogin = (data: LoginData) => {
        console.log("Dữ liệu đăng nhập: ", data);
    }
    return (
        <LoginForm onLogin={handleLogin}/>
    );
}
export default LoginPage;