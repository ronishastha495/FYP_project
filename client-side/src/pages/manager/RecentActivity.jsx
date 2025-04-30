import React from "react";
import { FaCar, FaTools, FaBuilding, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const RecentActivity = () => {
  const activities = [
    {
      icon: <FaCar className="text-blue-600" />,
      title: "Vehicle Added: Toyota ",
      description: "A new vehicle, Toyota  2021, has been added to the inventory.",
      performer: "Service Manager",
      time: "2 hours ago",
    },
    {
      icon: <FaTools className="text-blue-600" />,
      title: "Service Added: Engine Check",
      description: "A new service, Engine Check, has been added to the offerings.",
      performer: "Service Manager",
      time: "1 day ago",
    },
    {
      icon: <FaBuilding className="text-blue-600" />,
      title: "Service Center Registered: Damak Auto Center",
      description: "Test Auto Center has been registered in Test City.",
      performer: "Service Manager",
      time: "3 days ago",
    },
    {
      icon: <FaCheckCircle className="text-blue-600" />,
      title: "Booking Confirmed: Booking ",
      description: "A vehicle booking for user testuser has been confirmed.",
      performer: "Service Manager",
      time: "5 hours ago",
    },
    {
      icon: <FaTimesCircle className="text-blue-600" />,
      title: "Booking Cancelled: Booking ",
      description: "A service booking for user testuser has been cancelled.",
      performer: "Customer",
      time: "1 day ago",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Performed by {activity.performer} • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;