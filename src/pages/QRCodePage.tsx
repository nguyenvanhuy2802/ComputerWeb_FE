import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import QRCode from "../components/QRCode";
import {ToastContainer} from "react-toastify";

const OrderPage: React.FC = () => {
    return (
        <>
            <Header/>
            <QRCode/>
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
export default OrderPage;
