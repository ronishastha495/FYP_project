import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';

const ChatList = ({ onUserSelect, selectedUser }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUser = async () => {
    if (!searchText) return;

    const token = localStorage.getItem('accessToken');

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/chat/api/search/?user=${searchText}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
        console.warn("Search response is not an array:", res.data);
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUserId = parseInt(localStorage.getItem('userId'));
    const token = localStorage.getItem('accessToken');

    setLoading(true);
    setError(null);

    axios.get('http://localhost:8000/chat/api/get-messages/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const uniqueUsers = [];
        const userMap = {};

        if (Array.isArray(res.data)) {
          res.data.forEach(msg => {
            const user =
              msg.sender_profile.id === currentUserId
                ? msg.receiver_profile
                : msg.sender_profile;

            if (user && user.id !== currentUserId && !userMap[user.id]) {
              userMap[user.id] = true;
              uniqueUsers.push(user);
            }
          });
        } else {
          console.warn("Messages response is not an array:", res.data);
        }

        setUsers(uniqueUsers);
      })
      .catch(error => {
        setError('Error fetching messages. Please try again later.');
        console.error('Error fetching messages:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full flex flex-col p-4 bg-white rounded-2xl shadow-lg border border-indigo-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-indigo-900 mb-1">Conversations</h2>
        <p className="text-sm text-indigo-400">Connect with your contacts</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchUser()}
          className="w-full pl-10 pr-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 placeholder-indigo-300 text-indigo-900"
        />
        {searchText && (
          <button
            onClick={() => setSearchText('')}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
        <button
          onClick={searchUser}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">
          {error}
        </div>
      )}

      {/* User List with Minimized Height and Scrollbar */}
      <div className="flex-1 h-56 overflow-y-auto custom-scrollbar pr-1">
        {!loading && Array.isArray(users) && users.length > 0 ? (
          <ul className="space-y-1">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => onUserSelect(user)}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedUser && selectedUser.id === user.id
                    ? 'bg-gradient-to-r from-indigo-100 to-violet-100 shadow-md'
                    : 'hover:bg-indigo-50'
                }`}
              >
                <div className="relative">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${selectedUser && selectedUser.id === user.id ? 'text-indigo-900' : 'text-gray-800'}`}>
                      {user.username}
                    </span>
                    <span className="text-xs text-indigo-400">12:34 PM</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">Last message preview...</p>
                </div>
              </li>
            ))}
          </ul>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg className="w-16 h-16 text-indigo-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
            </svg>
            <p className="text-indigo-400 font-medium">No conversations found</p>
            <p className="text-xs text-indigo-300 mt-1">Search for users to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;