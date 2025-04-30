import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
// import Navbar from "../common/Navbar";

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  const currentUserId = parseInt(localStorage.getItem("userId"));

  const fetchMessages = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.get(
        "http://localhost:8000/chat/api/get-messages/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched messages:", res.data);

      if (!selectedUser || !selectedUser.id) {
        console.error('selectedUser or selectedUser.id is missing');
        return;
      }
      
      console.log("Fetched messages:", res.data);

      if (!selectedUser || !selectedUser.id) {
        console.error('selectedUser or selectedUser.id is missing');
        return;
      }

      const filtered = res.data.filter((msg) => {
        const senderId = parseInt(msg.sender);
        const receiverId = parseInt(msg.receiver);
        const currentUserIdInt = parseInt(currentUserId);
        const selectedUserIdInt = parseInt(selectedUser.id);

        console.log(`Filtering message with senderId: ${senderId}, receiverId: ${receiverId}`);

        return (
          (senderId === currentUserIdInt && receiverId === selectedUserIdInt) ||
          (receiverId === currentUserIdInt && senderId === selectedUserIdInt)
        );
      });

      console.log("Filtered messages:", filtered);

      setMessages(filtered);
      
      console.log("Filtered messages:", filtered);      

      setMessages(filtered);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(
        "http://localhost:8000/chat/api/send/",
        {
          sender: currentUserId,
          receiver: selectedUser.id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 1000);
      return () => clearInterval(intervalId);
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-indigo-400 text-lg font-medium">
        <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-indigo-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          Select a user to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
      {/* Chat Header */}
      <div className="border-b border-indigo-100 pb-3 mb-2 px-6 pt-4 bg-gradient-to-r from-indigo-50 to-violet-50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
            {selectedUser.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900">
              {selectedUser.username}
            </h3>
            <p className="text-xs text-indigo-400">Online now</p>
          </div>
        </div>
      </div>

      {/* Messages Area with Minimized Height and Scrollbar */}
      <div className="flex-1 h-56 overflow-y-auto p-5 space-y-4 bg-indigo-50/30 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-indigo-300 text-center">
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow-sm transition-all duration-300 ${
                  msg.sender === currentUserId
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    : "bg-white text-gray-800 border border-indigo-100"
                } hover:shadow-md`}
              >
                <span className="block">{msg.message}</span>
                <span
                  className={`text-xs block mt-1 ${
                    msg.sender === currentUserId
                      ? "text-indigo-100"
                      : "text-gray-400"
                  }`}
                >
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-indigo-100">
        <div className="flex items-center space-x-3 bg-indigo-50 rounded-full p-1 pl-4 shadow-inner">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-indigo-900 placeholder-indigo-300"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
