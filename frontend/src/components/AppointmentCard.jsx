import React from 'react';

const AppointmentCard = ({ booking, onChat, onSendReminder, onUpdate, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div>
        <h4 className="text-lg font-semibold">{booking.service}</h4>
        <p className="text-gray-600">User: {booking.user.username}</p>
        <p className="text-gray-600">Date: {booking.date}</p>
        <p className="text-gray-600">Time: {booking.time}</p>
        <p className="text-gray-600">Vehicle: {booking.vehicle_model || 'N/A'}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={onChat}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Chat
        </button>
        <button
          onClick={onSendReminder}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send Reminder
        </button>
        <button
          onClick={() => onUpdate({ ...booking, notes: 'Updated by manager' })}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;