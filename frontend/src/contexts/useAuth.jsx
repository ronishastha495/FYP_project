import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { is_authenticated, login, register } from "../endpoints/api";

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
                localStorage.setItem("role", response.role);
                nav('/');
            }
        } catch {
            alert("Invalid login");
        }
    };

    const register_user = async (username, email, password, Cpassword, role) => {
        if(password === Cpassword) {
            try{
                await register(username, email, password, role);
                alert('User registered successfully');
            } catch{
                alert('Error registering user');
            }
        } else {
            alert('Passwords do not match');
        }
    }

    useEffect(() => {
        get_authenticated();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login_user, register_user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
