import React, { useState } from "react";
import { toast } from "react-toastify";

const Reminders = ({ users, sendReminder, reminders }) => {
  const [reminderData, setReminderData] = useState({ userId: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setReminderData({ ...reminderData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!reminderData.userId) return "Please select a user";
    if (!reminderData.message.trim()) return "Reminder message is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await sendReminder(reminderData);
      toast.success("Reminder sent successfully! 📩", {
        position: "top-right",
        autoClose: 3000,
      });
      setReminderData({ userId: "", message: "" });
    } catch (error) {
      const errorMessage = error.message || "Failed to send reminder";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="reminders" className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Send Reminder ({reminders?.length || 0})
      </h3>
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="userId"
          value={reminderData.userId}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select User</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <textarea
          name="message"
          value={reminderData.message}
          onChange={handleChange}
          placeholder="Reminder Message"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full p-3 text-white rounded-lg transition duration-300 ${
            loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reminder"}
        </button>
      </form>
    </div>
  );
};

export default Reminders;