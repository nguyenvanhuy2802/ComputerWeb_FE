import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {ToastContainer} from "react-toastify";
import Payment from "../components/Payment";

const PaymentPage: React.FC = () => {
    return (
        <>
            <Header/>
            <Payment/>
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
    )
        ;
};

export default PaymentPage;