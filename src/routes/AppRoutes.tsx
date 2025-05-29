import React from "react";

import {Route, Routes, Form} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PaymentPage from "../pages/PaymentPage";
import OrderPage from "../pages/OrderPage";
import HomePage from "../pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/cart" element={<CartPage/>}/>
            <Route path="/payment" element={<PaymentPage/>}/>
            <Route path="/orders" element={<OrderPage/>}/>
            <Route
                path="/"
                element={
                //     <PrivateRoute>
                        <HomePage/>
                    // </PrivateRoute>
                }
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage/>} />

        </Routes>
    );
};

export default AppRoutes;
