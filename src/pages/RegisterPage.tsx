import React from 'react';
import RegisterForm from '../components/RegisterForm';
import {RegisterData} from '../types/User';
import {register} from "../api/authApi";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const RegisterPage: React.FC = () => {
    const handleRegister = async (data: RegisterData) => {
        try {
            const response = await register(data);
            if (response.success) {
                toast.success("Đăng ký thành công!");
            } else {
                toast.error(`Đăng ký thất bại: ${response.message}`);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình đăng ký.");
        }
    };
    return (
        <>
            <RegisterForm onRegister={handleRegister}/>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>

    );
};


export default RegisterPage;
