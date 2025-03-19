import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { getBookings } from '../endpoints/api';

const Bookings = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = React.useState([]);

  React.useEffect(() => {
    if (isAuthenticated) {
      getBookings()
        .then((data) => setBookings(data))
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{booking.service}</h3>
            <p className="text-gray-600">{booking.date} at {booking.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;