import React from "react";
import {Routes, Route, Form} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
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
