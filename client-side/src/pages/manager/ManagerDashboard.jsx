import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { useManager } from "../../contexts/ManagerContext";
import { useAuth } from "../../contexts/useAuth";
import Footer from "../../components/common/Footer";
import AddVehicles from "./AddVehicles";
import AddServicing from "./AddServicing";
import AddServiceCenter from "./AddServiceCenter";
import Profile from "./Profile";
import ChatPage from "../../components/chat/ChatPage";
import RecentActivity from "./RecentActivity";
import Notifications from "./Notifications";
import AppointmentHandling from "./AppointmentHandling";
import { FaUsers, FaCar, FaTools, FaUser, FaBuilding, FaComments } from "react-icons/fa";
import { LogOut, Car, Calendar, Wrench, Bell, ClipboardCheck, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BOOKINGS_URL } from "../../api/serviceManager";

const ManagerDashboard = () => {
  const {
    vehicles,
    services,
    serviceCenters,
    bookings,
    loading,
    error,
    addNewVehicle,
    addNewService,
    addNewServiceCenter,
  } = useManager();

  const { user, logout_user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [previousSection, setPreviousSection] = useState("dashboard");
  const [managerName, setManagerName] = useState("");
  const [customerCount, setCustomerCount] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    setManagerName(user?.username || "");
  }, [user]);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        setCustomerCount(8);
      } catch (err) {
        console.error("Failed to fetch customer count:", err);
        setCustomerCount(6);
        toast.error("Failed to fetch customer count");
      }
    };
    if (user?.role === "service_manager") {
      fetchCustomerCount();
    }
  }, [user]);

  useEffect(() => {
    if (Array.isArray(bookings) && bookings.length > 0) {
      setBookingsCount(bookings.length);
    } else {
      axiosInstance
        .get(BOOKINGS_URL)
        .then(res => setBookingsCount(res.data.length))
        .catch(err => {
          console.error("Failed to fetch bookings:", err);
          setBookingsCount(2);
          toast.error("Failed to fetch bookings");
        });
    }
  }, [bookings]);

  const handleLogout = async () => {
    try {
      await logout_user();
      toast.success("Logged out successfully!", { position: "top-right", autoClose: 3000 });
      navigate("/login");
    } catch {
      toast.error("Failed to logout.", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleSectionChange = (section) => {
    if (section !== activeSection) {
      setPreviousSection(activeSection);
      setActiveSection(section);
    }
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-blue-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  const sidebarItems = [
    { name: "Dashboard", icon: <FaUsers />, section: "dashboard" },
    { name: "Vehicles", icon: <FaCar />, section: "vehicles" },
    { name: "Servicing", icon: <FaTools />, section: "servicing" },
    { name: "Service Centers", icon: <FaBuilding />, section: "servicecenters" },
    { name: "Profile", icon: <FaUser />, section: "profile" },
    { name: "Chat", icon: <FaComments />, section: "chat" },
  ];

  const statCards = [
    {
      title: "Total Customers",
      value: customerCount ?? "—",
      icon: <FaUsers className="h-6 w-6 text-white" />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Total Vehicles",
      value: vehicles.length,
      icon: <Car className="h-6 w-6 text-white" />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Appointments",
      value: bookingsCount ?? "—",
      icon: <Calendar className="h-6 w-6 text-white" />,
      gradient: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    },
    {
      title: "Total Services",
      value: services.length,
      icon: <Wrench className="h-6 w-6 text-white" />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "Unread Notifications",
      value: 4, // Placeholder
      icon: <Bell className="h-6 w-6 text-white" />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "New Messages",
      value: 7, // Placeholder
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <aside
        className={`fixed top-0 left-0 h-full bg-blue-200 shadow text-black-bold w-64 z-20 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Manager Portal</h2>
          <ul className="space-y-4">
            {sidebarItems.map(item => (
              <li key={item.section}>
                <button
                  onClick={() => handleSectionChange(item.section)}
                  className={`flex items-center w-full p-3 rounded-lg hover:bg-blue-300 transition-colors ${
                    activeSection === item.section ? "bg-blue-300" : ""
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 mt-8 rounded-lg bg-blue-400 hover:bg-blue-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-3" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <div className="text-gray-600 font-medium">{currentDate}</div>
          <div className="flex items-center">
            <div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-white mr-2">
              {managerName.charAt(0) || "M"}
            </div>
            <span className="text-gray-700 font-medium">{managerName}</span>
          </div>
        </header>

        <main className="p-6">
          {activeSection === "dashboard" && (
            <div className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((card, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div
                      className="mr-4 rounded-full p-3 flex-shrink-0"
                      style={{ background: card.gradient }}
                    >
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{card.title}</p>
                      <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <RecentActivity />
                </div>
                <div>
                  <Notifications />
                </div>
              </div>

              <div className="mt-8">
                <AppointmentHandling bookings={bookings} />
              </div>
            </div>
          )}

          {activeSection === "vehicles" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <AddVehicles vehicles={vehicles} addNewVehicle={addNewVehicle} />
            </div>
          )}

          {activeSection === "servicing" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <AddServicing addNewService={addNewService} />
            </div>
          )}

          {activeSection === "servicecenters" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <AddServiceCenter onAddServiceCenter={addNewServiceCenter} />
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <Profile profile={user} updateProfile={() => {}} />
            </div>
          )}

          {activeSection === "chat" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <ChatPage setActiveSection={setActiveSection} previousSection={previousSection} />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ManagerDashboard;