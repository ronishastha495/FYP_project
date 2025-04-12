import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "../../services/websocket";

const ChatPage = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState({
        id: localStorage.getItem("userId"),
        role: localStorage.getItem("role")
    });
    const [newMessage, setNewMessage] = useState("");

    const authAxios = axios.create({
        baseURL: "http://localhost:8000/",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    authAxios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    const response = await axios.post(
                        "http://localhost:8000/api/token/refresh/",
                        { refresh: refreshToken }
                    );
                    localStorage.setItem("accessToken", response.data.access);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return authAxios(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    navigate("/login");
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!localStorage.getItem("accessToken")) {
                    navigate("/login");
                    return;
                }

                const chatsResponse = await authAxios.get("/chat/conversations/");
                setChats(chatsResponse.data);

                if (userId) {
                    const chat = chatsResponse.data.find(c => c.other_user.id === parseInt(userId));
                    if (chat) {
                        setSelectedChat(chat);
                        await fetchMessages(chat.other_user.id);
                    }
                } else if (chatsResponse.data.length > 0) {
                    setSelectedChat(chatsResponse.data[0]);
                    await fetchMessages(chatsResponse.data[0].other_user.id);
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        if (currentUser.id) {
            connectWebSocket(currentUser.id, handleIncomingMessage);
        }

        return () => {
            disconnectWebSocket();
        };
    }, [userId]);

    const fetchMessages = async (otherUserId) => {
        try {
            const response = await authAxios.get(`/chat/messages/?user_id=${otherUserId}`);
            setSelectedChat(prev => ({
                ...prev,
                messages: response.data
            }));
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const handleIncomingMessage = (message) => {
        const newMsg = JSON.parse(message.body);
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.other_user.id === newMsg.sender_id || chat.other_user.id === newMsg.receiver_id
                    ? {
                        ...chat,
                        last_message: newMsg.content,
                        last_message_time: newMsg.timestamp,
                        unread_count: newMsg.sender_id !== currentUser.id
                            ? (chat.unread_count || 0) + 1
                            : 0
                    }
                    : chat
            )
        );

        if (selectedChat &&
            (selectedChat.other_user.id === newMsg.sender_id ||
                selectedChat.other_user.id === newMsg.receiver_id)) {
            setSelectedChat(prev => ({
                ...prev,
                messages: [...prev.messages, newMsg]
            }));
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleChatSelect = async (chat) => {
        if (chat.unread_count > 0) {
            try {
                await authAxios.post(`/chat/messages/mark-read/`, {
                    sender_id: chat.other_user.id
                });

                setChats(prevChats =>
                    prevChats.map(c =>
                        c.other_user.id === chat.other_user.id
                            ? { ...c, unread_count: 0 }
                            : c
                    )
                );
            } catch (err) {
                console.error("Error marking messages as read:", err);
            }
        }

        setSelectedChat(chat);
        await fetchMessages(chat.other_user.id);
        navigate(`/chat/messages/${chat.other_user.id}`);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || !currentUser.id) return;

        try {
            const message = {
                sender_id: parseInt(currentUser.id),
                receiver_id: selectedChat.other_user.id,
                content: newMessage
            };

            sendMessage(message);

            const optimisticMessage = {
                id: Date.now(),
                sender: currentUser.id,
                receiver: selectedChat.other_user.id,
                content: newMessage,
                timestamp: new Date().toISOString(),
                is_optimistic: true
            };

            setSelectedChat(prev => ({
                ...prev,
                messages: [...prev.messages, optimisticMessage]
            }));

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.other_user.id === selectedChat.other_user.id
                        ? {
                            ...chat,
                            last_message: newMessage,
                            last_message_time: new Date().toISOString()
                        }
                        : chat
                )
            );

            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const filteredChats = searchQuery
        ? chats.filter(chat =>
            chat.other_user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : chats;

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Chat List Panel */}
            <div className="w-1/3 bg-white border-r border-gray-300">
                <div className="p-4 border-b border-gray-300 flex items-center justify-between">
                    <button onClick={handleBack} className="flex items-center text-blue-600">
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <h1 className="text-lg font-semibold">Messages</h1>
                    <div className="w-6"></div>
                </div>
                <div className="p-4 border-b border-gray-300">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-y-auto h-[calc(100%-116px)]">
                    {filteredChats.map(chat => (
                        <div
                            key={chat.id}
                            className={`p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100 flex items-center ${selectedChat?.id === chat.id ? 'bg-gray-100' : ''}`}
                            onClick={() => handleChatSelect(chat)}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                                    {chat.other_user.avatar ? (
                                        <img
                                            src={chat.other_user.avatar}
                                            alt={chat.other_user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        chat.other_user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-sm">{chat.other_user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
                            </div>
                            {chat.unread_count > 0 && (
                                <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                    {chat.unread_count}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Panel */}
            <div className="w-2/3 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-300 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                            {selectedChat?.other_user.avatar ? (
                                <img
                                    src={selectedChat?.other_user.avatar}
                                    alt={selectedChat?.other_user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                selectedChat?.other_user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <p className="font-semibold">{selectedChat?.other_user.name}</p>
                    </div>
                    <FaEllipsisV />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChat?.messages?.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-3 max-w-xs rounded-lg ${
                                msg.sender === parseInt(currentUser.id)
                                    ? "bg-blue-100 ml-auto text-right"
                                    : "bg-gray-200 text-left"
                            }`}
                        >
                            <p>{msg.content}</p>
                            <small className="text-xs text-gray-500 block mt-1">{new Date(msg.timestamp).toLocaleString()}</small>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 flex items-center">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
