import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const BookingForm = ({ service, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'service', // 'service' or 'purchase'
    vehicleModel: '',
    serviceType: service?.title || '',
    purchaseModel: '',
    date: '',
    time: '',
    notes: '',
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

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
    if (step === 1 && !formData.type) return;
    if (step === 2) {
      if (formData.type === 'service' && !formData.vehicleModel) return;
      if (formData.type === 'purchase' && !formData.purchaseModel) return;
    }
    if (step === 3 && (!formData.date || !formData.time)) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const totalSteps = 4;

  return (
    <div>
    <div className="fixed inset-0 bg-indigo-50 flex items-center justify-center z-50 animate-slideIn">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg">
      <Navbar />
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Book Appointment</h2>
        <p className="text-gray-600 text-center mb-6">Service: {service?.title}</p>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step > index + 1 ? 'bg-blue-500 text-white' : step === index + 1 ? 'bg-blue-300 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <p className="text-sm mt-2 text-gray-600">
                {index === 0 ? 'Type' : index === 1 ? 'Details' : index === 2 ? 'Date & Time' : 'Notes'}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Type */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Select Booking Type</h3>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  <option value="service">Service</option>
                  <option value="purchase">Purchase</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle/Purchase Details */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Enter Details</h3>
              {formData.type === 'service' ? (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Vehicle Model</label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="e.g., Toyota Corolla"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Service Type</label>
                    <input
                      type="text"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      readOnly={!!service}
                    />
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-semibold">Purchase Model</label>
                  <select
                    name="purchaseModel"
                    value={formData.purchaseModel}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Select a car</option>
                    <option value="Toyota Camry">Toyota Camry</option>
                    <option value="Honda Civic">Honda Civic</option>
                    <option value="Ford Mustang">Ford Mustang</option>
                    <option value="Tesla Model 3">Tesla Model 3</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Select Date & Time</h3>
              <div className="flex space-x-6">
                {/* Date Picker */}
                <div className="w-1/2">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      className="text-gray-600 hover:text-blue-500 transition duration-200"
                    >
                      &lt;
                    </button>
                    <span className="text-lg font-semibold text-gray-800">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      className="text-gray-600 hover:text-blue-500 transition duration-200"
                    >
                      &gt;
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-gray-500 font-semibold">
                        {day}
                      </div>
                    ))}
                    {daysInMonth().map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => day && handleDateSelect(day)}
                        className={`p-2 rounded-full ${
                          day
                            ? selectedDate &&
                              selectedDate.getDate() === day &&
                              selectedDate.getMonth() === currentMonth.getMonth()
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-blue-100 text-gray-800'
                            : 'text-transparent'
                        } transition duration-200`}
                        disabled={!day}
                      >
                        {day || ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Picker */}
                <div className="w-1/2">
                  <h4 className="text-gray-700 mb-2 font-semibold">Available Time Slots</h4>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`p-2 border rounded-lg ${
                          selectedTime === time
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
                        } transition duration-200`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Notes */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 4: Additional Notes</h3>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  placeholder="Any additional details..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
              >
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ml-auto"
              >
                Next
              </button>
            ) : (
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
    //  
    <Footer />
</div>
  );
};


export default BookingForm;