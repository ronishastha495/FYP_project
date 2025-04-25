import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, register, logout, refreshToken } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const clearLocalStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  const get_authenticated = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsAuthenticated(false);
        setRole(null);
        setUser(null);
        return false;
      }

      // Simple token presence check - we'll assume valid if token exists
      // (The token validity will be checked when making actual API calls)
      const userRole = localStorage.getItem("role") || "customer";
      let userData;
      try {
        userData = JSON.parse(localStorage.getItem("user")) || {};
      } catch {
        userData = {};
      }

      setIsAuthenticated(true);
      setRole(userRole);
      setUser(userData);
      return true;

    } catch (error) {
      console.error("Authentication check error:", error);
      clearLocalStorage();
      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login_user = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await login(username, password);
      console.log("Login response:", response);
      if (response?.access && response?.refresh) {
        const userRole = response.role || "customer";
        const userData = {
          id: response.user?.id || undefined,
          username: response.user?.username || username,
          email: response.user?.email || undefined,
          phone_number: response.user?.phone_number || undefined,
          address: response.user?.address || undefined,
          city: response.user?.city || undefined,
          country: response.user?.country || undefined,
          role: userRole,
        };
        setIsAuthenticated(true);
        setRole(userRole);
        setUser(userData);
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);
        localStorage.setItem("role", userRole);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Logged in successfully!");
        
        // Redirect based on role
        if (userRole === "service_manager") {
          navigate("/manager");
        } else {
          navigate("/");
        }
        return response;
      }
      throw new Error("Invalid login credentials");
    } catch (error) {
      const errorMsg = error.response?.status === 401 ? "Incorrect username or password" : error.message || "Login failed";
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register_user = async (username, email, password, confirm_password, role, phone_number, address, city, country) => {
    setIsLoading(true);
    try {
      const response = await register({ username, email, password, confirm_password, role, phone_number, address, city, country });
      toast.success("Registration successful! Please log in.");
      navigate("/login");
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "Registration failed";
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout_user = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed, clearing session anyway");
    } finally {
      clearLocalStorage();
      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
      setIsLoading(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const init = async () => {
      const isAuth = await get_authenticated();
      if (!isAuth && !["/login", "/register"].includes(window.location.pathname)) {
        navigate("/login");
      }
    };
    init();
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        user,
        isLoading,
        login_user,
        register_user,
        logout_user,
        get_authenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);