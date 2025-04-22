// components/manager/NotificationsPage.js
import React from "react";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Notifications</h1>
      <p className="text-gray-600">View your notifications here.</p>
      <Link to="/" className="text-blue-600 hover:underline mt-4 block">Back to Dashboard</Link>
    </div>
  );
};

export default NotificationsPage;