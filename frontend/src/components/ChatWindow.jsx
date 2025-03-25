import React, { useState, useEffect } from 'react';

const ChatWindow = ({ customer, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch chat history (assumes API integration with your chat system)
    // For now, mock data
    setMessages([
      { sender: customer.username, message: 'Hello, I have a question about my booking.' },
      { sender: 'Manager', message: 'Sure, how can I help you?' },
    ]);
  }, [customer]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: 'Manager', message }]);
      setMessage('');
      // Send message via WebSocket (integrate with your chat system)
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-96 bg-white rounded-t-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chat with {customer.username}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
      </div>
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              msg.sender === 'Manager' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-gray-800'
            } max-w-xs`}
          >
            <p className="font-semibold">{msg.sender}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;