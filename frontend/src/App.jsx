import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/useAuth";
import { UserProvider } from "./contexts/UserContext";
import { BookingProvider } from "./contexts/BookingContext";
import NotFound from "./pages/not_found";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./pages/Home.jsx";
import ManagerDash from "./pages/manager/ManagerDash.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import { ManagerProvider } from "./contexts/ManagerContext";
import Services from "./pages/Services.jsx";
import UserDash from "./pages/user/userdash.jsx";
import BookingPage from "./pages/Booking.jsx";
import TrackingPage from "./pages/Tracking.jsx";
import AboutUs from "./pages/Aboutus.jsx";
import ChatPage from "./pages/manager/ManagerChat.jsx";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BookingProvider>
            <>
              <ToastContainer position="top-right" autoClose={2000} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/services" element={<Services />} />
                <Route path="/userdash" element={<UserDash />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/tracking" element={<TrackingPage />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/managerchat" element={<ChatPage />} />


                <Route
                  path="/manager"
                  element={
                    <ProtectedRoute
                      element={
                        <ManagerProvider>
                          <ManagerDash />
                        </ManagerProvider>
                      }
                      allowedRoles={["service_manager"]}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </>
        </BookingProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;