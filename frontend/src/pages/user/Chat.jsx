import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaEllipsisV, FaPaperPlane } from "react-icons/fa";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { FaComments } from "react-icons/fa";

const UserChat = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  
  // Mock service managers data
  const [serviceManagers, setServiceManagers] = useState([
    {
      id: 1,
      name: "Service Manager",
      avatar: "/avatars/service-manager.jpg",
      role: "Vehicle Service Department",
      lastActive: "Online",
      status: "online",
      messages: [
        { id: 1, sender: "them", text: "Hello! How can I help you with your vehicle service needs today?", time: "10:15 am" },
        { id: 2, sender: "user", text: "Hi, I need to schedule maintenance for my car.", time: "10:17 am" },
        { id: 3, sender: "them", text: "Certainly! Could you provide me with your vehicle details and preferred service date?", time: "10:18 am" },
        { id: 4, sender: "user", text: "It's a 2019 Toyota Camry, and I'd like to schedule for next Tuesday if possible.", time: "10:20 am" },
        { id: 5, sender: "them", text: "Tuesday works well. We have openings at 9:00 AM, 11:30 AM, or 2:00 PM. Which would you prefer?", time: "10:21 am" },
      ]
    },
    {
      id: 2,
      name: "John Thompson",
      avatar: "/avatars/john.jpg",
      role: "Parts Department Manager",
      lastActive: "5 minutes ago",
      status: "away",
      messages: [
        { id: 1, sender: "them", text: "Hello! Do you need any specific parts for your vehicle?", time: "Yesterday" },
        { id: 2, sender: "user", text: "Yes, I was wondering if you have brake pads for a 2018 Honda Civic?", time: "Yesterday" },
        { id: 3, sender: "them", text: "We do have those in stock. Would you like me to reserve them for you?", time: "Yesterday" },
      ]
    },
    {
      id: 3,
      name: "Lisa Garcia",
      avatar: "/avatars/lisa.jpg",
      role: "Customer Service Manager",
      lastActive: "2 days ago",
      status: "offline",
      messages: [
        { id: 1, sender: "them", text: "Thank you for your feedback on our services. We're always working to improve.", time: "2 days ago" },
      ]
    }
  ]);

  // Scroll to bottom of messages when messages update
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  useEffect(() => {
    // Select the first chat by default
    if (serviceManagers.length > 0 && !selectedChat) {
      setSelectedChat(serviceManagers[0]);
    }
  }, [serviceManagers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleChatSelect = (manager) => {
    setSelectedChat(manager);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Create new message
    const newMsg = {
      id: selectedChat.messages.length + 1,
      sender: "user",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update the chats state
    const updatedManagers = serviceManagers.map(manager => {
      if (manager.id === selectedChat.id) {
        return {
          ...manager,
          messages: [...manager.messages, newMsg]
        };
      }
      return manager;
    });

    setServiceManagers(updatedManagers);
    setSelectedChat(updatedManagers.find(manager => manager.id === selectedChat.id));
    setNewMessage("");

    // Simulate response after a delay
    setTimeout(() => {
      const responseMsg = {
        id: selectedChat.messages.length + 2,
        sender: "them",
        text: "Thank you for your message. A service advisor will respond shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedManagersWithResponse = serviceManagers.map(manager => {
        if (manager.id === selectedChat.id) {
          return {
            ...manager,
            messages: [...manager.messages, newMsg, responseMsg]
          };
        }
        return manager;
      });

      setServiceManagers(updatedManagersWithResponse);
      setSelectedChat(updatedManagersWithResponse.find(manager => manager.id === selectedChat.id));
    }, 1000);
  };

  const filteredManagers = searchQuery 
    ? serviceManagers.filter(manager => 
        manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manager.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : serviceManagers;

    return (
      <div className="flex flex-col min-h-screen bg-gray-100 bg-opacity-90" 
           style={{ 
             backgroundImage: "url('/images/car-service-bg.jpg')", 
             backgroundSize: "cover", 
             backgroundPosition: "center",
             backgroundAttachment: "fixed",
             backgroundBlendMode: "overlay" 
           }}>
        <Navbar />
        
        {/* Add extra padding to push content below navbar */}
        <div className="flex-grow container mx-auto pt-24 my-8 px-4">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row" 
            style={{ minHeight: "70vh" }}
          >
            {/* Chat List Panel */}
            <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
                <h2 className="text-xl font-semibold">My Conversations</h2>
                <p className="text-sm opacity-75">Chat with our service team</p>
              </div>
            
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Chat List */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 130px)" }}>
              {filteredManagers.map(manager => (
                <div 
                  key={manager.id} 
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${selectedChat?.id === manager.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                  onClick={() => handleChatSelect(manager)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                        {manager.avatar ? (
                          <img src={manager.avatar} alt={manager.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          manager.name.charAt(0)
                        )}
                      </div>
                      {manager.status === 'online' && (
                        <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      {manager.status === 'away' && (
                        <div className="absolute bottom-0 right-2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{manager.name}</h3>
                        <span className="text-xs text-gray-500">
                          {manager.messages.length > 0 ? manager.messages[manager.messages.length - 1].time : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{manager.role}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {manager.messages.length > 0 ? 
                            (manager.messages[manager.messages.length - 1].sender === 'user' ? 'You: ' : '') + 
                            manager.messages[manager.messages.length - 1].text : 
                            'No messages'}
                        </p>
                        <p className="text-xs font-medium" style={{ color: manager.status === 'online' ? '#10B981' : '#6B7280' }}>
                          {manager.lastActive}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Content Panel */}
          <div className="w-full md:w-2/3 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      onClick={handleBack}
                      className="md:hidden mr-4 text-blue-600"
                    >
                      <FaArrowLeft />
                    </button>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                        {selectedChat.avatar ? (
                          <img src={selectedChat.avatar} alt={selectedChat.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          selectedChat.name.charAt(0)
                        )}
                      </div>
                      {selectedChat.status === 'online' && (
                        <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      {selectedChat.status === 'away' && (
                        <div className="absolute bottom-0 right-2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-800">{selectedChat.name}</h2>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          selectedChat.status === 'online' ? 'bg-green-500' : 
                          selectedChat.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></span>
                        <p className="text-sm text-gray-500">
                          {selectedChat.status === 'online' ? 'Online' : selectedChat.lastActive}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 p-2">
                    <FaEllipsisV />
                  </button>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ maxHeight: "calc(70vh - 180px)" }}>
                  <div className="py-2 px-3 bg-blue-50 text-blue-700 rounded-md mb-6">
                    <p className="text-sm">You're chatting with {selectedChat.name} from {selectedChat.role}. We typically respond within 5 minutes.</p>
                  </div>
                  
                  {selectedChat.messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      {message.sender !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2 self-end">
                          {selectedChat.avatar ? (
                            <img src={selectedChat.avatar} alt={selectedChat.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            selectedChat.name.charAt(0)
                          )}
                        </div>
                      )}
                      <div className={`max-w-xs md:max-w-md ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        } shadow-sm`}>
                          <p>{message.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex justify-between">
                          <span>{message.sender === 'user' ? 'You' : selectedChat.name}</span>
                          <span>{message.time}</span>
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ml-2 self-end">
                          You
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition-colors"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">Our team typically responds within 5 minutes during business hours (9AM-5PM).</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6">
                <div className="bg-gray-200 p-6 rounded-full mb-4">
                  <FaComments className="text-4xl text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Your Conversations</h3>
                <p className="text-gray-500 text-center mb-4">Select a conversation to start messaging with our service team.</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setSelectedChat(serviceManagers[0])}
                >
                  Start New Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserChat;