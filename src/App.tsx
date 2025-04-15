import React from 'react';
import './App.css';
import LoginPage from "./pages/LoginPage";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path={"/"} element={<LoginPage/>}/>
                <Route path={"/register"} element={<RegisterPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
            </Routes>
        </Router>
    );
}

export default App;


