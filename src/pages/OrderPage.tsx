import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import Orders from "../components/Order";

const OrderPage: React.FC = () => {
    return (
        <>
            <Header/>
            <Orders/>
            <Footer/>

        </>
    );
}
export default OrderPage;
