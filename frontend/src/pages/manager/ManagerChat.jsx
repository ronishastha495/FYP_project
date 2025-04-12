import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaEllipsisV } from "react-icons/fa";

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Sample chat data - replace with actual data from your backend
  const [chats, setChats] = useState([
    {
      id: 1,
      user: {
        id: 1,
        name: "Sharon Lessman",
        avatar: "/avatars/sharon.jpg",
        lastActive: "Online",
        status: "online"
      },
      messages: [
        { id: 1, sender: "user", text: "Lorem ipsum dolor sit amet, vis erat denique in. dicunt prodesset te vix.", time: "2:33 am" },
        { id: 2, sender: "them", text: "Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.", time: "2:34 am" },
        { id: 3, sender: "user", text: "Cum ea graeci tractatos.", time: "2:35 am" },
        { id: 4, sender: "them", text: "Sed pulvinar. massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit. Proin ultricies placerat imperdiet. Morbi varius quam ac venenatis tempus.", time: "2:36 am" },
        { id: 5, sender: "them", text: "Cras pulvinar, sapien id vehicula aliquet, diam velit elementum orci.", time: "2:37 am" },
        { id: 6, sender: "user", text: "Lorem ipsum dolor sit amet, vis erat denique in. dicunt prodesset te vix.", time: "2:38 am" },
      ]
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "Moz",
        avatar: "/avatars/moz.jpg",
        lastActive: "2 days ago",
        status: "offline"
      },
      messages: [
        { id: 1, sender: "them", text: "I am doing perfectly okay bro", time: "2 days ago" }
      ]
    }
  ]);

  useEffect(() => {
    // Select the first chat by default
    if (chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page (dashboard)
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const filteredChats = searchQuery 
    ? chats.filter(chat => 
        chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  const [newMessage, setNewMessage] = useState("");

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
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(updatedChats.find(chat => chat.id === selectedChat.id));
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Panel */}
      <div className="w-1/3 bg-white border-r border-gray-300">
        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
          <button 
            onClick={handleBack} 
            className="flex items-center text-blue-600"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-lg font-semibold">Messages</h1>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </div>
        
        {/* Search */}
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
        
        {/* Chat List */}
        <div className="overflow-y-auto h-[calc(100%-116px)]">
          {filteredChats.map(chat => (
            <div 
              key={chat.id} 
              className={`p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100 flex items-center ${selectedChat?.id === chat.id ? 'bg-gray-100' : ''}`}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                  {chat.user.avatar ? (
                    <img src={chat.user.avatar} alt={chat.user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    chat.user.name.charAt(0)
                  )}
                </div>
                {chat.user.status === 'online' && (
                  <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{chat.user.name}</h3>
                  <span className="text-xs text-gray-500">
                    {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].time : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'No messages'}
                </p>
                <p className="text-xs text-gray-400">
                  {chat.user.lastActive}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Content Panel */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-white">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                  {selectedChat.user.avatar ? (
                    <img src={selectedChat.user.avatar} alt={selectedChat.user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    selectedChat.user.name.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="font-medium">{selectedChat.user.name}</h2>
                  <p className="text-xs text-gray-500">{selectedChat.user.lastActive}</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <FaEllipsisV />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedChat.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {message.sender !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
                      {selectedChat.user.avatar ? (
                        <img src={selectedChat.user.avatar} alt={selectedChat.user.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        selectedChat.user.name.charAt(0)
                      )}
                    </div>
                  )}
                  <div className="max-w-xs">
                    {message.sender !== 'user' && (
                      <p className="text-xs text-gray-500 mb-1">{selectedChat.user.name}</p>
                    )}
                    <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} shadow`}>
                      <p>{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 ml-2">
                      <span>You</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-300 bg-white">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;