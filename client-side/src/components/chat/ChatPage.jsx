import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../common/Navbar';

const ChatPage = ({ setActiveSection, previousSection }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleBack = () => {
    setActiveSection(previousSection || 'dashboard');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      <Navbar/>
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>
      {/* Chat Content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/3 bg-white border border-gray-200 shadow-sm rounded-lg">
          <ChatList onUserSelect={setSelectedUser} selectedUser={selectedUser} />
        </div>
        {/* Chat Box */}
        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-lg">
          <ChatBox selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;