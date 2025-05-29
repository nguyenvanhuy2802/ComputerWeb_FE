import React from "react";
import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PaymentPage from "../pages/PaymentPage";
import OrderPage from "../pages/OrderPage";

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
        </Routes>
    );
};

export default AppRoutes;
