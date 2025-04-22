import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate, setSelectedTime } from "../redux/bookingSlice";

const DateTimeSelector = () => {
  const dispatch = useDispatch();
  const { selectedDate, selectedTime } = useSelector((state) => state.booking);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const timeSlots = [
    "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "11:00 AM", "01:00 PM", "01:15 PM", "01:30 PM",
    "01:45 PM", "02:00 PM", "02:15 PM", "02:30 PM",
    "02:45 PM", "03:00 PM", "04:15 PM", "04:30 PM", "04:45 PM",
  ];

  const handleDateChange = (date) => {
    const formattedDate = `2025-03-${date.toString().padStart(2, "0")}`;
    dispatch(setSelectedDate(formattedDate));
  };

  const handleTimeChange = (time) => {
    dispatch(setSelectedTime(time));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full lg:w-1/2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Ronisha Shrestha
      </h2>
      <p className="text-gray-600 text-center mb-6">Cardiologist</p>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Select Date & Time
      </h3>
      <div className="flex justify-between items-center mb-4">
        <button className="text-blue-500 hover:text-blue-700">&lt;</button>
        <span className="text-lg font-semibold">March 2025</span>
        <button className="text-blue-500 hover:text-blue-700">&gt;</button>
      </div>
      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2 text-center mb-6">
        <div className="text-gray-500">Su</div>
        <div className="text-gray-500">Mo</div>
        <div className="text-gray-500">Tu</div>
        <div className="text-gray-500">We</div>
        <div className="text-gray-500">Th</div>
        <div className="text-gray-500">Fr</div>
        <div className="text-gray-500">Sa</div>
        {Array(6).fill(null).map((_, index) => (
          <div key={`empty-${index}`}></div>
        ))}
        {daysInMonth.map((day) => (
          <div
            key={day}
            className={`calendar-day smooth-transition hover-scale ${
              selectedDate === `2025-03-${day.toString().padStart(2, "0")}`
                ? "border-2 border-blue-500 rounded-full"
                : ""
            }`}
            onClick={() => handleDateChange(day)}
          >
            {day}
          </div>
        ))}
      </div>
      {/* Time Slots */}
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        Available Time Slots
      </h4>
      <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
        {timeSlots.map((time) => (
          <button
            key={time}
            className={`border rounded-lg p-2 time-slot smooth-transition ${
              selectedTime === time ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handleTimeChange(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateTimeSelector;