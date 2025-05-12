import React from "react";
import {Routes, Route} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import PrivateRoute from "./PrivateRoute";

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
        </Routes>
    );
};

export default AppRoutes;
