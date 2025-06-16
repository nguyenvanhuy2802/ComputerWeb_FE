import React, {JSX} from "react";
import {Navigate, useLocation} from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
}

const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    const location = useLocation();

    return isAuthenticated() ? (
        children
    ) : (
        <Navigate to="/login" replace state={{from: location}}/>
    );
};

export default PrivateRoute;
