import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'John Doe', text: 'Hey, how are you?', time: '10:30 AM', isSent: false },
    { id: 2, sender: 'You', text: 'I’m good, thanks! How about you?', time: '10:32 AM', isSent: true },
    { id: 3, sender: 'John Doe', text: 'Doing great! Want to catch up later?', time: '10:35 AM', isSent: false },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50">
      <Navbar />

      <main className="flex-grow container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-extrabold text-center text-indigo-800 mb-12 tracking-wide drop-shadow-md">
          Chat
        </h2>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto border border-indigo-100 flex flex-col h-[70vh]">
          {/* Message List */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-4 rounded-xl shadow-md transition-all duration-300 ${
                      msg.isSent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="font-semibold">{msg.sender}</p>
                    <p className="mt-1">{msg.text}</p>
                    <span className="block text-xs mt-2 opacity-75">{msg.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center mt-20">No messages yet. Start chatting!</p>
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-6 border-t border-indigo-100 bg-gray-50 rounded-b-2xl flex items-center gap-4"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 font-semibold shadow-md"
            >
              Send
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;