import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { getReminders } from '../endpoints/api';

const Reminders = () => {
  const { isAuthenticated } = useAuth();
  const [reminders, setReminders] = React.useState([]);

  React.useEffect(() => {
    if (isAuthenticated) {
      getReminders()
        .then((data) => setReminders(data))
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Reminders</h2>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{reminder.message}</h3>
            <p className="text-gray-600">{reminder.date} at {reminder.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;