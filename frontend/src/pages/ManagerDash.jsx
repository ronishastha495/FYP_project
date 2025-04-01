import React from "react";
import { useManager } from "../contexts/ManagerContext";
import Footer from "../components/common/Footer";
import UsersCard from "../components/manager/UserCard";
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

  // Calculate progress based on available data
  const totalTasks = 5; // Users, Vehicles, Servicing, Profile, Reminders
  const completedTasks = [
    users?.length > 0,
    vehicles?.length > 0,
    appointmentsCount > 0,
    profile?.name,
    reminders?.length > 0
  ].filter(Boolean).length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl font-semibold text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 fixed h-full shadow-lg">
        <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Manager Dashboard
        </h2>
        <ul className="space-y-4">
          <li><a href="#users" className="hover:text-blue-300 transition-colors duration-200">Users</a></li>
          <li><a href="#vehicles" className="hover:text-blue-300 transition-colors duration-200">Vehicles</a></li>
          <li><a href="#servicing" className="hover:text-blue-300 transition-colors duration-200">Servicing</a></li>
          <li><a href="#profile" className="hover:text-blue-300 transition-colors duration-200">Profile</a></li>
          <li><a href="#reminders" className="hover:text-blue-300 transition-colors duration-200">Reminders</a></li>
          <li><a href="#notifications" className="hover:text-blue-300 transition-colors duration-200">Notifications</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Progress Indicator */}
        <div className="fixed top-0 left-64 right-0 z-10">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between px-8 py-4 bg-white shadow-sm">
              <div>
                <span className="text-sm font-medium text-gray-600">Dashboard Progress</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-blue-600">{`${completedTasks}/${totalTasks} Tasks`}</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex bg-gray-200">
              <div 
                style={{ width: `${progressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-in-out"
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <UsersCard users={users} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <AddVehicles vehicles={vehicles} addNewVehicle={addNewVehicle} users={users} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <AddServicing appointmentsCount={appointmentsCount} addService={addService} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Profile profile={profile} updateProfile={updateProfile} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Reminders users={users} sendReminder={sendReminder} reminders={reminders} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Notifications users={users} sendNotification={sendNotification} notifications={notifications} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ManagerDashboard;