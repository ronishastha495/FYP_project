import React from "react";
import { useManager } from "../contexts/ManagerContext";
import Footer from "../components/common/Footer";
import UsersCard from "../components/manager/UserCard"; // Note: "UserCard" instead of "UsersCard"
import AddVehicles from "../components/manager/AddVehicles";
import AddServicing from "../components/manager/AddServicing";
import Profile from "../components/manager/Profile";
import Reminders from "../components/manager/Reminders";
import Notifications from "../components/manager/Notifications";

const ManagerDashboard = () => {
  const {
    profile,
    vehicles,
    appointmentsCount,
    notifications,
    reminders,
    loading,
    updateProfile,
    addNewVehicle,
    sendReminder,
    sendNotification,
    users,
    addService
  } = useManager();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl font-semibold text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 fixed h-full">
        <h2 className="text-2xl font-bold mb-8">Manager Dashboard</h2>
        <ul className="space-y-4">
          <li><a href="#users" className="hover:text-blue-300">Users</a></li>
          <li><a href="#vehicles" className="hover:text-blue-300">Vehicles</a></li>
          <li><a href="#servicing" className="hover:text-blue-300">Servicing</a></li>
          <li><a href="#profile" className="hover:text-blue-300">Profile</a></li>
          <li><a href="#reminders" className="hover:text-blue-300">Reminders</a></li>
          <li><a href="#notifications" className="hover:text-blue-300">Notifications</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <UsersCard users={users} />
          <AddVehicles vehicles={vehicles} addNewVehicle={addNewVehicle} users={users} /> {/* Added users prop */}
          <AddServicing appointmentsCount={appointmentsCount} addService={addService} />
          <Profile profile={profile} updateProfile={updateProfile} />
          <Reminders users={users} sendReminder={sendReminder} reminders={reminders} />
          <Notifications users={users} sendNotification={sendNotification} notifications={notifications} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ManagerDashboard;