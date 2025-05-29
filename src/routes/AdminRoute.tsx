import React, {JSX} from "react";
import { Navigate } from "react-router-dom";
import {getUserRoleFromToken} from "../utils/jwtUtils";

interface AdminRouteProps {
    children: JSX.Element;
}

const isAdmin = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const role = getUserRoleFromToken(token);
    return role === "ROLE_ADMIN";
};

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    return isAdmin() ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;