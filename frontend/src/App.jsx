import { Routes, Route } from "react-router-dom";
import "./App.css";
import NotFound from "./pages/not_found";
import SignupForm from "./pages/signup.jsx";
import Login from "./routes/login.jsx";
import Register from "./routes/register.jsx";
import Menu from "./routes/menu.jsx";
import PrivateRoute from "./components/private_routes.jsx";
import { AuthProvider } from "./contexts/useAuth";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/menu"
                    element={
                        <PrivateRoute>
                            <Menu />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;