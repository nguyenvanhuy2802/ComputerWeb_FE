import React, {JSX} from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
}

const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;