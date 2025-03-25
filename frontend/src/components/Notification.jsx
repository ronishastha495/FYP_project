import React from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const { notification } = useSelector((state) => state.booking);

  if (!notification) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Appointment Confirmation
      </h3>
      <p className="text-gray-600 mb-1">
        <strong>From:</strong> {notification.from}
      </p>
      <p className="text-gray-600 mb-1">
        <strong>Subject:</strong> {notification.subject}
      </p>
      <p className="text-gray-600 mb-1">
        <strong>Reply-To:</strong> {notification.replyTo}
      </p>
      <p className="text-gray-600 mb-1">
        <strong>Date:</strong> {notification.date}
      </p>
      <p className="text-gray-600 mt-4 whitespace-pre-line">
        {notification.message}
      </p>
    </div>
  );
};

export default Notification;