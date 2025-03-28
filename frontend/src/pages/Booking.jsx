import React, { useState } from 'react';
import { createBooking } from '../api/services';

const BookingForm = ({ service, vehicles, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'service',
    vehicleModel: '',
    serviceType: service?.title || '',
    date: '',
    time: '',
    notes: '',
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState(null);

  const timeSlots = [
    '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '01:00 PM', '01:15 PM', '01:30 PM',
    '01:45 PM', '02:00 PM', '02:15 PM', '02:30 PM',
    '02:45 PM', '03:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selected);
    setFormData({ ...formData, date: selected.toISOString().split('T')[0] });
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setFormData({ ...formData, time });
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const daysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysArray = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const handleNext = () => {
    if (step === 1 && !formData.vehicleModel) return;
    if (step === 2 && (!formData.date || !formData.time)) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await createBooking(formData);
      onSubmit(response);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step > num ? 'bg-green-500' : step === num ? 'bg-blue-500' : 'bg-gray-200'
                } text-white`}
              >
                {num}
              </div>
              <p className="text-sm mt-2">
                {num === 1 ? 'Vehicle' : num === 2 ? 'Schedule' : 'Confirm'}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Vehicle</label>
                <select
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Choose a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.model}>
                      {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Date</label>
                <div className="border rounded p-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      className="text-gray-600 hover:text-blue-500"
                    >
                      Previous
                    </button>
                    <span>
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      className="text-gray-600 hover:text-blue-500"
                    >
                      Next
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center font-semibold">
                        {day}
                      </div>
                    ))}
                    {daysInMonth().map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={!day}
                        onClick={() => day && handleDateSelect(day)}
                        className={`p-2 text-center ${
                          !day
                            ? 'text-gray-300'
                            : selectedDate &&
                              selectedDate.getDate() === day &&
                              selectedDate.getMonth() === currentMonth.getMonth()
                            ? 'bg-blue-500 text-white rounded'
                            : 'hover:bg-gray-100 rounded'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`p-2 text-center rounded ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : 'border hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Confirm Booking Details</h3>
              <div className="bg-gray-50 p-4 rounded mb-4">
                <p><strong>Service:</strong> {service?.title}</p>
                <p><strong>Vehicle:</strong> {formData.vehicleModel}</p>
                <p><strong>Date:</strong> {formData.date}</p>
                <p><strong>Time:</strong> {formData.time}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Any special requests or notes?"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;