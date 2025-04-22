import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { chatService } from "../api/chat";  
import { useAuth } from "./useAuth";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Handle connection state changes
    const handleConnectionChange = useCallback((state) => {
        setIsConnected(state === 'CONNECTED');
    }, []);

    // Handle WebSocket errors
    const handleError = useCallback((error) => {
        setError(error.message);
        if (error.message.includes('authentication') || error.message.includes('token')) {
            navigate('/login');
        }
    }, [navigate]);

    // Handle incoming messages
    const handleMessage = useCallback((message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    // Initialize WebSocket handlers
    useEffect(() => {
        if (user?.id) {
            chatService.onConnectionChange(handleConnectionChange);
            chatService.onError(handleError);
            chatService.onMessage(handleMessage);

            return () => {
                chatService.removeConnectionHandler(handleConnectionChange);
                chatService.removeErrorHandler(handleError);
                chatService.removeMessageHandler(handleMessage);
                chatService.cleanup();
            };
        }
    }, [user?.id, handleConnectionChange, handleError, handleMessage]);

    const value = {
        messages,
        isConnected,
        error,
        setError
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);