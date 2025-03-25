import { createContext, useContext, useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { is_authenticated, login, register, logout } from "../endpoints/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const nav = useNavigate();

    const get_authenticated = async () => {
        try {
            const success = await is_authenticated();
            if (success) {
                setIsAuthenticated(true);
                setRole(success.role);
            }
        } catch {
            setIsAuthenticated(false);
        }
    };

    const login_user = async (username, password) => {
        try {
            const response = await login(username, password);
            if (response) {
                setIsAuthenticated(true);
                setRole(response.role);
                localStorage.setItem("role", response.role); // ✅ Store role in localStorage

                // ✅ Navigate based on role
                if (response.role === "Service Manager") {
                    nav('/manager'); // Redirect to Service Manager page
                } else {
                    nav('/'); // Default Home page
                }
            }
        } catch {
            alert("Invalid login");
        }
    };

    const logout_user = async () => {
        try {
            const success = await logout();
            if (success) {
                setIsAuthenticated(false);
                setRole(null);
                localStorage.removeItem("role"); // ✅ Remove role from localStorage
                nav('/login'); // Redirect to login page
            }
        } catch {
            alert("Logout failed");
        }
    };

    useEffect(() => {
        get_authenticated();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login_user, logout_user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
