import { Routes, Route } from "react-router-dom";
import "./App.css";
import NotFound from "./pages/not_found";
import Login from "./routes/login.jsx";
import Register from "./routes/register.jsx";
import Landing from "./routes/landing.jsx";
import PrivateRoute from "./components/private_routes.jsx";
import { AuthProvider } from "./contexts/useAuth";
import ForgotPassword from "./components/ForgetPassword.jsx";
import VehicleList from "./components/VehicleList.jsx";
import ServicePage from "./pages/appointment.jsx";
import UserDashboard from "./pages/userdash.jsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/appointment" element={<ServicePage />} />
                <Route path="/appointment" element={<UserDashboard />} />

                <Route path="/forgot-password" element={<ForgotPassword />} /> 
                <Route path="/" element={<VehicleList />} />
                <Route
                    path="/menu"
                    element={
                        <PrivateRoute>
                            <Landing />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;