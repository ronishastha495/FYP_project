import { createContext, useContext, useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { is_authenticated, login, register, logout } from "../api/auth";

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

    // In login_user function:
    const login_user = async (username, password) => {
        try {
          const response = await login(username, password); // Using the API function
          if (response) {
            setIsAuthenticated(true);
            const role = response.user?.role || response.role;
            setRole(role);
            localStorage.setItem("role", role);
            return response;
          }
        } catch (error) {
          console.error("Login error:", error);
          throw error; // Rethrow to handle in component
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
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            role, 
            login_user, 
            logout_user 
          }}>
            {children}
          </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
