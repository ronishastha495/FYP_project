import React from "react";

const Notification = ({ onClose }) => {
  // Dummy notification data
  const notifications = [
    {
      id: 1,
      title: "Service Reminder",
      message: "Your oil change is due in 2 days!",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Booking Confirmed",
      message: "Your appointment on April 10th is confirmed.",
      time: "1 day ago",
    },
    {
      id: 3,
      title: "New Offer",
      message: "Get 20% off your next tire rotation!",
      time: "3 days ago",
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      {notifications.length > 0 ? (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200"
            >
              <h4 className="text-sm font-medium text-gray-800">
                {notification.title}
              </h4>
              <p className="text-xs text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No new notifications</p>
      )}
      <div className="mt-3 text-center">
        <button
          onClick={onClose}
          className="text-indigo-600 hover:underline text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notification;