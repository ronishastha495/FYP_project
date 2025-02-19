import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { is_authenticated, login, register } from "../endpoints/api"; // Ensure `login` is imported

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    const get_authenticated = async () => {
        try {
            const success = await is_authenticated();
            setIsAuthenticated(success);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login_user = async (username, password) => {
        const success = await login(username, password);
        if (success) {
            setIsAuthenticated(true);
            nav('/');
        }
    };

    const register_user = async (username, email, password, Cpassword) => {
        if(password === Cpassword) {
            try{
                await register(username, email, password)
                alert('successfully registering user')
            } catch{
                alert('error registering user')
            }
            
        } else {
            alert('password dont match')
        }

    }

    useEffect(() => {
        get_authenticated();
    }, [nav]); // Use `nav` to detect route changes

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login_user , register_user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);