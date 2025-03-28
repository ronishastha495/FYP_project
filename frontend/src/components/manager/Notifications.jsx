import React, { useState } from "react";

const Notifications = ({ users, sendNotification, notifications }) => {
  const [notificationData, setNotificationData] = useState({ userId: "", message: "" });

  const handleChange = (e) => {
    setNotificationData({ ...notificationData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendNotification(notificationData);
    alert("Notification sent!");
    setNotificationData({ userId: "", message: "" });
  };

  return (
    <div id="notifications" className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Send Notification ({notifications.length})</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="userId"
          value={notificationData.userId}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select User</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <textarea
          name="message"
          value={notificationData.message}
          onChange={handleChange}
          placeholder="Notification Message"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition duration-300"
        >
          Send Notification
        </button>
      </form>
    </div>
  );
};

export default Notifications;