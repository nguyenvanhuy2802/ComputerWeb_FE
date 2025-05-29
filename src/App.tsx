import React from 'react';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import {CartProvider} from "./context/CartContext";
import {UserProvider} from "./context/UserContext";



function App() {
    return (
        <UserProvider>
            <CartProvider>
                <Router>
                    <AppRoutes/>
                </Router>
            </CartProvider>
        </UserProvider>


    );
}

export default App;


