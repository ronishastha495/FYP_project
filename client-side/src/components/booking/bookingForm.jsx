import React, { useState, useEffect } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { toast } from 'react-toastify';
import backgroundImage from '../../assets/background.jpg'; // Import the background image

const BookingForm = ({ service, vehicle, onClose, onSubmit, onInputChange, formData }) => {
  const { customerVehicles, dealershipVehicles, services, loading: contextLoading } = useBooking();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    // Validate that either service or vehicle is selected
    if (!service && !vehicle) {
      toast.error('Please select a service or vehicle before booking.');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    } else {
      toast.error('Please fill all required fields');
    }
  };

  // Use useEffect to prevent unmounting during re-renders
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // This ensures the component stays mounted
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {service ? 'Book Service' : 'Book Vehicle Purchase Inquiry'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        {contextLoading && (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {service ? 'Service' : 'Vehicle'}
            </label>
            <p className="text-gray-600">
              {service ? service.name : `${vehicle?.make} ${vehicle?.model} (${vehicle?.year})`}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={onInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.date ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={onInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.time ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-200"
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
