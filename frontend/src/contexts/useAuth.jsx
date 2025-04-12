import { createContext, useContext, useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { is_authenticated, login, register, logout, refresh_token } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const nav = useNavigate();

    const get_authenticated = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsAuthenticated(false);
                setRole(null);
                setUser(null);
                setIsLoading(false);
                return false;
            }
            
            const response = await is_authenticated();
            if (response && response.authenticated) {
                setIsAuthenticated(true);
                const userRole = response.role || localStorage.getItem("role");
                const userData = {
                    id: response.user_id,
                    username: response.user || JSON.parse(localStorage.getItem("user"))?.username,
                    role: userRole
                };
                setRole(userRole);
                setUser(userData);
                localStorage.setItem("role", userRole);
                localStorage.setItem("user", JSON.stringify(userData));
                setIsLoading(false);
                return true;
            }
            
            // If is_authenticated fails, try refreshing token
            const refreshSuccess = await refresh_token();
            if (refreshSuccess) {
                // Try authentication again with new token
                const newResponse = await is_authenticated();
                if (newResponse && newResponse.authenticated) {
                    setIsAuthenticated(true);
                    const userRole = newResponse.role || localStorage.getItem("role");
                    setRole(userRole);
                    setUser(newResponse.user || null);
                    localStorage.setItem("role", userRole);
                    setIsLoading(false);
                    return true;
                }
            }
            
            // If all authentication attempts fail, clean up
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            setIsAuthenticated(false);
            setRole(null);
            setUser(null);
            setIsLoading(false);
            return false;
            
        } catch (error) {
            console.error("Authentication check failed:", error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            setIsAuthenticated(false);
            setRole(null);
            setUser(null);
            setIsLoading(false);
            return false;
        }
    };

    const login_user = async (username, password) => {
        console.log("sdfsdfsd");
        console.log("entering login_user function");
        setIsLoading(true);
        try {
            const response = await login(username, password);
            console.log("response:", response);
    
    
            if (response && response?.access) {
                console.log("hello, reachedin the if else");
                setIsAuthenticated(true);
                const userRole = response?.role;
                console.log("userRole:", userRole);
                const userData = {
                    id: response.user_id,
                    username: response.user || username,
                    role: userRole
                };
                setRole(userRole);
                console.log("role is", role)
                setUser(userData);
                console.log("user is", user)
                localStorage.setItem('role', userRole);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('accessToken', response.access);
                localStorage.setItem('refreshToken', response.refresh);
                setIsLoading(false);
                return response;
            }
    
            throw new Error('Invalid response format');
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            throw error;
        }
    };
    
        
    const logout_user = async () => {
        setIsLoading(true);
        try {
            const success = await logout();
            // Always clean up local state regardless of server response
            setIsAuthenticated(false);
            setRole(null);
            setUser(null);
            nav('/login');
            setIsLoading(false);
            return success;
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if server logout fails, clear local state
            setIsAuthenticated(false);
            setRole(null);
            setUser(null);
            setIsLoading(false);
            nav('/login');
            return false;
        }
    };

    // Token validation and auth check on component mount
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            // Check if we have a token - only then try to authenticate
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    await get_authenticated();
                } catch (error) {
                    console.error("Authentication check failed:", error);
                    setIsAuthenticated(false);
                    setRole(null);
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // No token, so we're definitely not authenticated
                setIsAuthenticated(false);
                setRole(null);
                setUser(null);
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            role,
            user,
            isLoading,
            login_user, 
            logout_user,
            get_authenticated
          }}>
            {children}
          </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
