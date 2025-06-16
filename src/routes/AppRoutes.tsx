import React from "react";
import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import PaymentPage from "../pages/PaymentPage";
import OrderPage from "../pages/OrderPage";
import PrivateRoute from "./PrivateRoute";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AdminLoginPage from "../admin/AdminLoginPage";
import AdminLayout from "../admin/AdminLayout";
import UserListPage from "../admin/pages/users/UserListPage";
import ProductListPage from "../admin/pages/products/ProductListPage";
import OrderListPage from "../admin/pages/oders/OrderListPage";
import AddUserPage from "../admin/pages/users/AddUserPage";
import EditUserPage from "../admin/pages/users/EditUserPage";
import AddProductPage from "../admin/pages/products/AddProductPage";
import EditProductPage from "../admin/pages/products/EditProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CategoryPage from "../pages/CategoryPage";
import SearchPage from "../pages/SearchPage";
import AdminRoute from "./AdminRoute";


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/product/:id" element={<ProductDetailPage/>}/>
            <Route path="/category/:id" element={<CategoryPage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/" element={<HomePage/>}/>
            <Route
                path="/cart"
                element={
                    <PrivateRoute>
                        <CartPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/payment"
                element={
                    <PrivateRoute>
                        <PaymentPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <PrivateRoute>
                        <OrderPage/>
                    </PrivateRoute>
                }
            />

            <Route path="/admin/login" element={<AdminLoginPage/>}/>

            {/* Trang dashboard được bảo vệ bằng AdminRoute */}
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminLayout/>
                </AdminRoute>
            }>
                <Route index element={<UserListPage/>}/>
                <Route path="users" element={<UserListPage/>}/>
                <Route path="users/create" element={<AddUserPage/>}/>
                <Route path="users/edit/:id" element={<EditUserPage/>}/>
                <Route path="products" element={<ProductListPage/>}/>
                <Route path="products/create" element={<AddProductPage/>}/>
                <Route path="products/edit/:id" element={<EditProductPage/>}/>
                <Route path="orders" element={<OrderListPage/>}/>

            </Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

        </Routes>
    );
};

export default AppRoutes;
