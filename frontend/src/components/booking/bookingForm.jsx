import React, { useState, useEffect } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { toast } from 'react-toastify';
import background from '../../assets/background.jpg';

const BookingForm = ({ service, vehicle, initialBookingType, onClose, onSubmit }) => {
  const { 
    customerVehicles, 
    dealershipVehicles, 
    services, 
    loading: contextLoading,
    createBooking 
  } = useBooking();
  
  // Log services data for debugging
  useEffect(() => {
    console.log('Services in BookingForm:', services);
  }, [services]);
  
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState(initialBookingType || (service ? 'servicing' : vehicle ? 'purchase' : ''));
  const [formData, setFormData] = useState({
    booking_type: initialBookingType || (service ? 'servicing' : vehicle ? 'purchase' : ''),
    vehicle_id: '',
    vehicle_context: '',
    service_id: service?.id || '',
    date: '',
    time: '',
    notes: '',
    purchase_details: vehicle ? `Interested in ${vehicle.make} ${vehicle.model} (${vehicle.year})` : '',
    trade_in_vehicle_id: ''
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // If we have a service or vehicle, skip to step 2
  useEffect(() => {
    if ((service || vehicle) && step === 1) {
      setStep(2);
    }
  }, [service, vehicle, step]);

  // Get the appropriate vehicle list based on booking type
  const vehicles = bookingType === 'servicing' ? customerVehicles : dealershipVehicles;

  const timeSlots = [
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '13:00', '13:15', '13:30',
    '13:45', '14:00', '14:15', '14:30',
    '14:45', '15:00', '16:15', '16:30', '16:45',
  ];

  // Handle booking type selection
  const handleBookingTypeSelect = (type) => {
    setBookingType(type);
    setFormData({
      ...formData,
      booking_type: type,
      vehicle_context: type === 'servicing' ? 'customer_owned' : 'dealership_vehicle',
      vehicle_id: '',
      service_id: type === 'servicing' ? service?.id || '' : '',
      purchase_details: type === 'purchase' && vehicle ? `Interested in ${vehicle.make} ${vehicle.model} (${vehicle.year})` : '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
  };

  const handleDateSelect = (day) => {
    if (day === null) return;
    
    const selected = new Date(
      currentMonth.getFullYear(), 
      currentMonth.getMonth(), 
      day
    );
    setSelectedDate(selected);
    setFormData({ 
      ...formData, 
      date: selected.toISOString().split('T')[0] 
    });
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

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!bookingType) {
          setError('Please select a booking type');
          toast.error('Please select a booking type');
          return false;
        }
        break;
      case 2:
        if (!formData.vehicle_id) {
          setError('Please select a vehicle');
          toast.error('Please select a vehicle');
          return false;
        }
        break;
      case 3:
        if (bookingType === 'servicing' && !formData.service_id) {
          setError('Please select a service');
          toast.error('Please select a service');
          return false;
        }
        if (bookingType === 'purchase' && !formData.purchase_details) {
          setError('Please enter purchase details');
          toast.error('Please enter purchase details');
          return false;
        }
        break;
      case 4:
        if (!formData.date || !formData.time) {
          setError('Please select both date and time');
          toast.error('Please select both date and time');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (formLoading) return;
    setFormLoading(true);
    
    try {
      const bookingData = {
        ...formData,
        date: selectedDate,
        time: selectedTime
      };
      
      const response = await createBooking(bookingData);
      toast.success('Booking created successfully!');
      onSubmit?.(response);
      onClose?.();
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setFormLoading(false);
    }
  };

  // Determine number of steps based on booking type
  const totalSteps = 5;

  // Render step progress
  const renderStepProgress = () => (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step > i + 1 ? 'bg-green-500 text-white' :
              step === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {i + 1}
          </div>
          <span className="text-xs mt-2">
            {i === 0 ? 'Type' : 
             i === 1 ? 'Vehicle' : 
             i === 2 ? (bookingType === 'servicing' ? 'Service' : 'Details') : 
             i === 3 ? 'Schedule' : 'Confirm'}
          </span>
        </div>
      ))}
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Booking Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleBookingTypeSelect('servicing')}
                className={`p-4 border rounded-lg ${bookingType === 'servicing' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              >
                <h4 className="font-medium">Vehicle Servicing</h4>
                <p className="text-sm text-gray-600">Book a service for your vehicle</p>
              </button>
              <button
                type="button"
                onClick={() => handleBookingTypeSelect('purchase')}
                className={`p-4 border rounded-lg ${bookingType === 'purchase' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              >
                <h4 className="font-medium">Vehicle Purchase</h4>
                <p className="text-sm text-gray-600">Book a test drive or purchase consultation</p>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Select {bookingType === 'servicing' ? 'Your Vehicle' : 'Vehicle of Interest'}
            </h3>
            {contextLoading ? (
              <p>Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <p>No vehicles available</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      vehicle_id: vehicle.id,
                      vehicle_context: bookingType === 'servicing' ? 'customer_owned' : 'dealership_vehicle'
                    })}
                    className={`p-3 border rounded-lg text-left ${
                      formData.vehicle_id === vehicle.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium">{vehicle.make} {vehicle.model}</h4>
                    <p className="text-sm text-gray-600">
                      {vehicle.year} • {vehicle.color} • {vehicle.vin}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        if (bookingType === 'servicing') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Service</h3>
              {contextLoading ? (
                <p>Loading services...</p>
              ) : services.length === 0 ? (
                <p>No services available</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        service_id: svc.id
                      })}
                      className={`p-3 border rounded-lg text-left ${
                        formData.service_id === svc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{svc.name}</h4>
                        <span className="font-bold">${svc.cost}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {svc.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Purchase Inquiry Details</h3>
              <div>
                <label className="block text-gray-700 mb-2">Details</label>
                <textarea
                  name="purchase_details"
                  value={formData.purchase_details}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg resize-none h-32"
                  placeholder="Please describe what you're interested in..."
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Do you have a trade-in vehicle?</label>
                <select
                  name="trade_in_vehicle_id"
                  value={formData.trade_in_vehicle_id}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">No trade-in</option>
                  {customerVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        }
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Schedule Appointment</h3>
            <div>
              <label className="block text-gray-700 mb-2">Select Date</label>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &lt;
                  </button>
                  <h4 className="font-medium">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &gt;
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 p-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {daysInMonth().map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={!day || new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < new Date().setHours(0, 0, 0, 0)}
                      onClick={() => handleDateSelect(day)}
                      className={`aspect-square p-2 text-center text-sm rounded-full ${
                        !day ? 'invisible' : 
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < new Date().setHours(0, 0, 0, 0) ? 'text-gray-300 cursor-not-allowed' :
                        selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() && 
                        selectedDate.getFullYear() === currentMonth.getFullYear() ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Select Time</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeSelect(time)}
                    className={`p-2 border rounded text-center text-sm ${
                      selectedTime === time ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Confirm Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Booking Type:</strong> {bookingType === 'servicing' ? 'Vehicle Servicing' : 'Vehicle Purchase Inquiry'}</p>
              <p><strong>Vehicle:</strong> {vehicles.find(v => v.id === formData.vehicle_id)?.make} {vehicles.find(v => v.id === formData.vehicle_id)?.model}</p>
              {bookingType === 'servicing' && (
                <p><strong>Service:</strong> {services.find(s => s.id === formData.service_id)?.name}</p>
              )}
              {bookingType === 'purchase' && (
                <div>
                  <p><strong>Purchase Details:</strong></p>
                  <p className="text-sm">{formData.purchase_details}</p>
                  {formData.trade_in_vehicle_id && (
                    <p><strong>Trade-in Vehicle:</strong> {customerVehicles.find(v => v.id === formData.trade_in_vehicle_id)?.make} {customerVehicles.find(v => v.id === formData.trade_in_vehicle_id)?.model}</p>
                  )}
                </div>
              )}
              <p><strong>Date/Time:</strong> {formData.date} at {formData.time}</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg resize-none h-32"
                placeholder="Any special requirements or information..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="fixed inset-0 bg-cover bg-center blur-sm" 
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
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

        {renderStepProgress()}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-6">
            {renderStepContent()}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={step === 1 ? onClose : handleBack}
              className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={formLoading}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {formLoading ? 'Submitting...' : 'Book Appointment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;