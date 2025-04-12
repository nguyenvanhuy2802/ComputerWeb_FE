import React from 'react';
import RegisterForm from '../components/RegisterForm';
import {RegisterData} from '../types/User';

const RegisterPage: React.FC = () => {
    const handleRegister = (data: RegisterData) => {
        console.log("Thông tin người dùng:", data);
    };

    return (
        <RegisterForm onRegister={handleRegister}/>
    );
};

export default RegisterPage;
