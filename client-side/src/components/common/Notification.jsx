import React, { useState } from "react";

// Updated dummy data for a vehicle service platform
const initialNotifications = [
  {
    id: 1,
    type: "new-vehicle",
    message: "John Doe registered a new vehicle: Toyota Camry 2023",
    time: "1h ago",
    isNew: true,
    isRead: false,
    icon: "🚗",
  },
  {
    id: 2,
    type: "service",
    message: "Your oil change service is scheduled for tomorrow!",
    time: "2h ago",
    isNew: true,
    isRead: false,
    icon: "🔧",
  },
  {
    id: 3,
    type: "manager",
    message: "Manager Sarah is now online to assist you",
    time: "5h ago",
    isNew: true,
    isRead: false,
    icon: "👩‍💼",
  },
  {
    id: 4,
    type: "booking",
    message: "Your booking for tire rotation on April 15th is confirmed",
    time: "1d ago",
    isNew: true,
    isRead: false,
    icon: "✅",
  },
  {
    id: 5,
    type: "service",
    message: "Your vehicle inspection is due in 3 days",
    time: "2d ago",
    isNew: false,
    isRead: true,
    icon: "🔍",
  },
  {
    id: 6,
    type: "new-vehicle",
    message: "Emily Smith registered a new vehicle: Honda Civic 2022",
    time: "3d ago",
    isNew: false,
    isRead: true,
    icon: "🚗",
  },
];

const Notification = ({ onClose }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // "all" or "unread"

  // Separate new and earlier notifications
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notif) => !notif.isRead)
      : notifications;

  const newNotifications = filteredNotifications.filter((notif) => notif.isNew);
  const earlierNotifications = filteredNotifications.filter(
    (notif) => !notif.isNew
  );

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } transition duration-200`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            filter === "unread"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } transition duration-200`}
        >
          Unread
        </button>
      </div>

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* New Notifications Section */}
      {newNotifications.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-gray-500 mb-2">NEW</h4>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {newNotifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start space-x-3 p-2 rounded-md transition duration-200 cursor-pointer ${
                  notification.isRead ? "bg-gray-50" : "bg-blue-50"
                } hover:bg-gray-100`}
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Earlier Notifications Section */}
      {earlierNotifications.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-gray-500 mt-4 mb-2">
            EARLIER
          </h4>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {earlierNotifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start space-x-3 p-2 rounded-md transition duration-200 cursor-pointer ${
                  notification.isRead ? "bg-gray-50" : "bg-blue-50"
                } hover:bg-gray-100`}
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* If no notifications */}
      {filteredNotifications.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          No {filter === "unread" ? "unread" : "new"} notifications
        </p>
      )}

      {/* See All Button */}
      {notifications.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm font-medium"
          >
            See All
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;