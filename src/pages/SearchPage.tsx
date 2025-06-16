import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Result from "../components/Result";
import {ToastContainer} from "react-toastify";

const SearchPage: React.FC = () => {
    return (
        <>
            <Header/>
            <Result/>
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
export default SearchPage;