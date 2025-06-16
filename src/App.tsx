import React from 'react';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import {CartProvider} from "./context/CartContext";
import {UserProvider} from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { SnackbarProvider } from 'notistack';

function App() {
    return (
       <SnackbarProvider maxSnack={3}>
        <UserProvider>
            <CartProvider>
                <Router>    
                    <AppRoutes/>
                </Router>
            </CartProvider>
        </UserProvider>
   </SnackbarProvider>

    );
}

export default App;


