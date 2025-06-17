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
    // if (location.pathname === "/payment") {
    //     return <Navigate to="/" />;
    // }

    return isAuthenticated() ? (
        children
    ) : (
        <Navigate to="/login"/>
    );
};

export default PrivateRoute;
