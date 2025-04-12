import React, { useState, useEffect } from "react";
import axios from "axios";
import { useManager } from "../../contexts/ManagerContext";
import Footer from "../../components/common/Footer";
import UsersCard from "./UserCard";
import AddVehicles from "./AddVehicles";
import AddServicing from "./AddServicing";
import Profile from "./Profile";
import Reminders from "./Reminders";
import Notifications from "./Notifications";
import { FaUsers, FaCar, FaTools, FaUser, FaBell, FaStickyNote, FaBars } from "react-icons/fa";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    addService,
    logout_user
  } = useManager();

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State to store the manager name
    const [managerName, setManagerName] = useState(null);

    // Fetch customer count from the API
    useEffect(() => {
      const fetchManagerName = async () => {
        try {
          const token = localStorage.getItem('accessToken')
          const response = await axios.get("http://localhost:8000/account/api/get-manager-name/", 
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
        });
          setManagerName(response.data.username);
          console.log("fetch managername output:  \n " , response)
        } catch (error) {
          console.error("Error fetching manaher name :", error);
        }
      };
  
      fetchManagerName();
    }, []);  // Empty dependency array means it will run once when the component mounts
  
  // State to store the customer count
  const [customerCount, setCustomerCount] = useState(null);

  // Fetch customer count from the API
  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/account/api/customer-count/");
        setCustomerCount(response.data.customer_count);
        console.log("customer count response \n " , response)
      } catch (error) {
        console.error("Error fetching customer count:", error);
      }
    };

    fetchCustomerCount();
  }, []);  // Empty dependency array means it will run once when the component mounts

   // State to store the customer count
   const [serviceCount, setServiceCount] = useState(null);

   // Fetch total service count from the API
   useEffect(() => {
     const fetchServiceCount = async () => {
       try {
         const response = await axios.get("http://localhost:8000/services/api/total-service-count");
         setServiceCount(response.data.service_count);
         console.log("service count response \n " , response)
       } catch (error) {
         console.error("Error fetching service count:", error);
       }
     };
 
     fetchServiceCount();
   }, []);  // Empty dependency array means it will run once when the component mounts 

      // State to store the customer count
      const [bookingsCount, setBookingsCount] = useState(null);

      // Fetch total service count from the API
      useEffect(() => {
        const fetchBookingsCount = async () => {
          try {
            const response = await axios.get("http://localhost:8000/services/api/total-booking-count/");
            setBookingsCount(response.data.total_bookings_count);
            console.log("total bookings count response \n " , response)
          } catch (error) {
            console.error("Error fetching total bookings count :", error);
          }
        };
    
        fetchBookingsCount();
      }, []);  // Empty dependency array means it will run once when the component mounts 

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout_user();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Dummy data for recent activity (replace with real data as needed)
  const recentActivities = [
    { id: 1, message: "New user registered: John Doe", time: "1 day ago", performed: "Performed by System Admin" },
    { id: 2, message: "New booking created for Vehicle #123", time: "1 day ago", performed: "Performed by System Admin" },
    { id: 3, message: "Booking completed for Vehicle #456", time: "2 days ago", performed: "Performed by Technician" },
    { id: 4, message: "Reminder sent to user for service", time: "3 days ago", performed: "Performed by User" },
  ];

  // Current date
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-2xl font-semibold text-blue-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-64 z-20`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
            <FaBars className="md:hidden text-2xl cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
          </div>
          <ul className="space-y-4">
            {[{ name: "Dashboard", icon: <FaUsers className="mr-2" />, href: "#dashboard" }, 
              { name: "Users", icon: <FaUsers className="mr-2" />, href: "#users" },
              { name: "Vehicles", icon: <FaCar className="mr-2" />, href: "#vehicles" },
              { name: "Servicing", icon: <FaTools className="mr-2" />, href: "#servicing" },
              { name: "Profile", icon: <FaUser className="mr-2" />, href: "#profile" },
              { name: "Reminders", icon: <FaStickyNote className="mr-2" />, href: "#reminders" }].map((item) => (
              <li key={item.name}>
                <a href={item.href} className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-all duration-300">
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
            <li>
              <button onClick={handleLogout} className="flex items-center p-2 w-full rounded-lg hover:bg-blue-700 transition-all duration-300">
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Hamburger Toggle for Mobile */}
      {!isSidebarOpen && (
        <div className="fixed top-4 left-4 z-30 md:hidden">
          <FaBars className="text-2xl text-gray-900 cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <div className="text-gray-500">{currentDate}</div>
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white mr-2">
              {managerName?.charAt(0) || "M"}
            </div>
            <span>{managerName || 'no-name'}</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-gray-500 text-sm mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{customerCount !== null ? customerCount : "Loading..."}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-gray-500 text-sm mb-2">Total Vehicles</h3>
              <p className="text-3xl font-bold">{vehicles?.length || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-gray-500 text-sm mb-2">Appointments</h3>
              <p className="text-3xl font-bold">{bookingsCount || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-gray-500 text-sm mb-2">Total Services</h3>
              <p className="text-3xl font-bold">{serviceCount !== null ? serviceCount : "Loading..."}</p>
            </div>
          </div>

          {/* Activity and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Activity - Takes 2/3 of the width */}
            <div className="lg:col-span-2 bg-white p-6 rounded-md shadow">
              <h3 className="text-lg font-medium text-blue-600 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start border-b pb-4">
                    <div className="bg-blue-100 p-2 rounded mr-4">
                      <FaUser className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.performed}</p>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications - Takes 1/3 of the width */}
            <div className="bg-white p-6 rounded-md shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-blue-600">Notifications</h3>
                <div className="flex space-x-2">
                  <button className="text-gray-500 text-sm hover:text-blue-600">Mark All as Read</button>
                  <button className="text-red-500 text-sm hover:text-red-600">Clear All</button>
                </div>
              </div>
              <div className="space-y-4">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-600">NOTIFICATION</span>
                        <button>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                    </div>
                  ))
                ) : (
                  <div className="border-b pb-4">
                    <p className="text-sm">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Dashboard Components */}
          <div id="users" className="bg-white p-6 rounded-md shadow mb-6">
            <UsersCard users={users} />
          </div>
          
          <div id="vehicles" className="bg-white p-6 rounded-md shadow mb-6">
            <AddVehicles vehicles={vehicles} addNewVehicle={addNewVehicle} users={users} />
          </div>
          
          <div id="servicing" className="bg-white p-6 rounded-md shadow mb-6">
            <AddServicing appointmentsCount={appointmentsCount} addService={addService} />
          </div>

          <div id="profile" className="bg-white p-6 rounded-md shadow mb-6">
            <Profile profile={profile} updateProfile={updateProfile} />
          </div>

          <div id="reminders" className="bg-white p-6 rounded-md shadow mb-6">
            <Reminders reminders={reminders} sendReminder={sendReminder} />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ManagerDashboard;
