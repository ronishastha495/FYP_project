// components/manager/NotificationsPage.js
import React from "react";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  // Dummy notification data
  const notifications = [
    {
      id: 1,
      type: "booking",
      message: "New booking request from user @ramesh123 is pending approval.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "registration",
      message: "New user @sita_sharma has registered successfully.",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      type: "message",
      message: "You received a new message from @bikash_2047.",
      timestamp: "Today at 10:15 AM",
    },
    {
      id: 4,
      type: "booking",
      message: "Pending service confirmation for user @anita.k.",
      timestamp: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white p-4 shadow-md rounded-md border-l-4 border-blue-500"
          >
            <p className="text-gray-800">{notif.message}</p>
            <span className="text-sm text-gray-500">{notif.timestamp}</span>
          </div>
        ))}
      </div>
      <Link to="/" className="text-blue-600 hover:underline mt-6 block">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotificationsPage;
