import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import {ToastContainer} from "react-toastify";
import React from "react";

const CartPage: React.FC = () => {
    return (
        <>
            <Header/>
            <Cart/>
            <Footer/>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}
export default CartPage;
