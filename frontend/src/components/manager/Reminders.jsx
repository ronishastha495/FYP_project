import React, { useState } from "react";

const Reminders = ({ users, sendReminder, reminders }) => {
  const [reminderData, setReminderData] = useState({ userId: "", message: "" });

  const handleChange = (e) => {
    setReminderData({ ...reminderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendReminder(reminderData);
    alert("Reminder sent!");
    setReminderData({ userId: "", message: "" });
  };

  return (
    <div id="reminders" className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Send Reminder ({reminders.length})</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="userId"
          value={reminderData.userId}
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
          value={reminderData.message}
          onChange={handleChange}
          placeholder="Reminder Message"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Send Reminder
        </button>
      </form>
    </div>
  );
};

export default Reminders;