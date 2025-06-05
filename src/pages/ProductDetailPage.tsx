import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {ToastContainer} from "react-toastify";
import ProductDetail from "../components/ProductDetail";

const ProductDetailPage: React.FC = () => {
    return (
        <>
            <Header/>
            <ProductDetail/>
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
export default ProductDetailPage;