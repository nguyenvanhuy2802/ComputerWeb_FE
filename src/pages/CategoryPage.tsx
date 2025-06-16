import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryComp from "../components/Category";
import {ToastContainer} from "react-toastify";

const CategoryPage: React.FC = () => {
    return (
        <>
            <Header/>
            <CategoryComp/>
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
export default CategoryPage;