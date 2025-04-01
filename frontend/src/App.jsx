import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/useAuth";

import NotFound from "./pages/not_found";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./pages/Home.jsx";
import ManagerDash from "./pages/ManagerDash.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import { ManagerProvider } from "./contexts/ManagerContext";
import Services from "./pages/Services.jsx";

import UserDash from "./pages/user/userdash.jsx";
import UserProfile from "./pages/user/userprofile.jsx";
import BookingForm from "./pages/Booking.jsx";

function App() {
    return (
        <AuthProvider>
            <ToastContainer position="top-right" autoClose={2000} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/services" element={<Services />} />
                <Route path="/userdash" element={<UserDash />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/booking" element={<BookingForm />} />

                <Route path="*" element={<NotFound />} />


                {/* Protect Manager Dashboard - Only allow Service Managers */}
                <Route 
                    path="/manager" 
                    element={
                        <ProtectedRoute 
                            element={
                                <ManagerProvider>  {/* ✅ Wrap the ManagerDash inside ManagerProvider */}
                                    <ManagerDash />
                                </ManagerProvider>
                            } 
                            allowedRoles={["service_manager"]} 
                        />
                    } 
                />
            </Routes>
        </AuthProvider>
    );
}


export default App;
