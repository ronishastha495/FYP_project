import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/useAuth";

import NotFound from "./pages/not_found";
import Login from "./routes/login.jsx";
import Register from "./routes/register.jsx";
import Home from "./pages/Home.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

function App() {
    return (
        <AuthProvider>
            <ToastContainer position="top-right" autoClose={2000} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />

                {/* Protect Manager Dashboard - Only allow Service Managers */}
                <Route 
                    path="/manager" 
                    element={<ProtectedRoute element={<ManagerDashboard />} allowedRoles={["service_manager"]} />} 
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
