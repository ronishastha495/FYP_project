// src/components/Chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';

const ChatWindow = () => {
  const { activeConversation, messages, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation) {
    return <div className="chat-window empty">Select a conversation to start chatting</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{activeConversation.name}</h3>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;