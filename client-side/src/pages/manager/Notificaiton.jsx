import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Doctor",
      description: "Doctor New Doc Test has been deleted from the system.",
      date: "4/26/2025",
      isRead: false,
    },
    {
      id: 2,
      type: "Doctor",
      description: "A new doctor named New Doc Test has been added to the system.",
      date: "4/26/2025",
      isRead: false,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="text-blue-600 text-sm hover:underline"
            disabled={notifications.every(notif => notif.isRead)}
          >
            Mark All as Read
          </button>
          <button
            onClick={handleClearAll}
            className="text-red-600 text-sm hover:underline"
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications available.</p>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="flex items-start space-x-4">
              <div className="text-2xl text-blue-600">
                <FaUserPlus />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-800">{notif.type}</h3>
                  {!notif.isRead && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">NEW</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{notif.description}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;