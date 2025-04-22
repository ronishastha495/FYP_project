import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  is_authenticated,
  login,
  register,
  logout,
  refresh_token,
} from "../api/auth";

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

      const response = await is_authenticated();
      if (response?.is_authenticated) {
        const userRole = response.user.role || localStorage.getItem("role") || "customer";
        let userData;
        try {
          userData = JSON.parse(localStorage.getItem("user")) || {};
        } catch {
          userData = {};
        }
        const updatedUserData = {
          id: response.user.id || userData.id,
          username: response.user.username || userData.username || "Unknown",
          role: userRole,
          phone_number: response.user.phone_number || userData.phone_number,
          address: response.user.address || userData.address,
          city: response.user.city || userData.city,
          country: response.user.country || userData.country,
        };
        setIsAuthenticated(true);
        setRole(userRole);
        setUser(updatedUserData);
        localStorage.setItem("role", userRole);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        return true;
      }

      const refreshSuccess = await refresh_token();
      if (refreshSuccess) {
        return await get_authenticated();
      }

      throw new Error("Authentication failed");
    } catch (error) {
      const errorMsg = error.response?.status === 401 ? "Session expired, please log in" : error.message || "Failed to verify authentication";
      toast.error(errorMsg);
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
      if (response?.access && response?.refresh) {
        const userRole = response.role || "customer";
        const userData = {
          id: response.id,
          username: response.user || username,
          role: userRole,
          phone_number: response.phone_number,
          address: response.address,
          city: response.city,
          country: response.country,
        };
        setIsAuthenticated(true);
        setRole(userRole);
        setUser(userData);
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);
        localStorage.setItem("role", userRole);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Logged in successfully!");
        navigate(userRole === "service_manager" ? "/manager" : "/");
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