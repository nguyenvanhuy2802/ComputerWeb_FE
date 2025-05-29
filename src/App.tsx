import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import { SnackbarProvider } from 'notistack';

function App() {
    return (
        <SnackbarProvider maxSnack={3}>
            <Router>
                <AppRoutes />
            </Router>
        </SnackbarProvider>

    );
}

export default App;


