// // src/contexts/ChatContext.jsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import chatService from '../services/chatService';
// import { useAuth } from './AuthContext';

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     if (user?.token) {
//       chatService.connect(user.token);
      
//       const messageListener = (data) => {
//         if (data.conversation_id === activeConversation?.id) {
//           setMessages(prev => [...prev, {
//             content: data.message,
//             sender: data.sender_id,
//             timestamp: data.timestamp
//           }]);
//         }
//       };
      
//       chatService.addListener(messageListener);
      
//       return () => {
//         chatService.disconnect();
//       };
//     }
//   }, [user, activeConversation]);

//   const sendMessage = (content) => {
//     if (activeConversation && user) {
//       chatService.sendMessage(content, activeConversation.id, user.id);
//     }
//   };

//   const value = {
//     conversations,
//     setConversations,
//     activeConversation,
//     setActiveConversation,
//     messages,
//     setMessages,
//     sendMessage,
//     onlineUsers
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

// export const useChat = () => useContext(ChatContext);