import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { useManager } from "../../contexts/ManagerContext";
import { useAuth } from "../../contexts/useAuth";
import Footer from "../../components/common/Footer";
import AddVehicles from "./AddVehicles";
import AddServicing from "./AddServicing";
import AddServiceCenter from "./AddServiceCenter";
import Profile from "./Profile";
import ChatPage from '../../components/chat/ChatPage'; // Import ChatPage
import { FaUsers, FaCar, FaTools, FaUser, FaBuilding, FaComments } from "react-icons/fa";
import { LogOut } from "lucide-react";
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
  const [previousSection, setPreviousSection] = useState("dashboard"); // Track previous section
  const [managerName, setManagerName] = useState("");
  const [customerCount, setCustomerCount] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Pull manager name from user (AuthContext)
  useEffect(() => {
    setManagerName(user?.username || "");
  }, [user]);

  // Fetch customer count
  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        // No valid users endpoint exists, so set to 0
        setCustomerCount(0);
      } catch (err) {
        console.error("Failed to fetch customer count:", err);
        setCustomerCount(0);
        toast.error("Failed to fetch customer count");
      }
    };
    if (user?.role === "service_manager") {
      fetchCustomerCount();
    }
  }, [user]);

  // Fetch bookings count
  useEffect(() => {
    if (Array.isArray(bookings) && bookings.length > 0) {
      setBookingsCount(bookings.length);
    } else {
      axiosInstance
        .get(BOOKINGS_URL)
        .then(res => setBookingsCount(res.data.length))
        .catch(err => {
          console.error("Failed to fetch bookings:", err);
          setBookingsCount(0);
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

  // Handle section change and track previous section
  const handleSectionChange = (section) => {
    if (section !== activeSection) {
      setPreviousSection(activeSection);
      setActiveSection(section);
    }
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-blue-600">Loading...</div>
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
    { name: "Chat", icon: <FaComments />, section: "chat" }, // Updated icon to FaComments
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 z-20 transform transition-transform ${
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
                  className={`flex items-center w-full p-2 rounded hover:bg-blue-700 ${
                    activeSection === item.section ? "bg-blue-700" : ""
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 mt-8 rounded bg-gradient-to-r from-yellow-400 to-purple-600 hover:opacity-90"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <div className="text-gray-500">{currentDate}</div>
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white mr-2">
              {managerName.charAt(0) || "M"}
            </div>
            {managerName}
          </div>
        </header>

        <main className="p-6">
          {/* Section Navigation */}
          <div className="flex space-x-2 mb-8 overflow-x-auto">
            {sidebarItems.map(item => (
              <button
                key={item.section}
                onClick={() => handleSectionChange(item.section)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  activeSection === item.section
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Dashboard Stats */}
          {activeSection === "dashboard" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Customers" value={customerCount ?? "—"} />
                <StatCard title="Total Vehicles" value={vehicles.length} />
                <StatCard title="Appointments" value={bookingsCount ?? "—"} />
                <StatCard title="Total Services" value={services.length} />
              </div>
            </div>
          )}

          {/* Vehicles */}
          {activeSection === "vehicles" && (
            <div className="bg-white p-6 rounded-md shadow">
              <AddVehicles vehicles={vehicles} addNewVehicle={addNewVehicle} />
            </div>
          )}

          {/* Servicing */}
          {activeSection === "servicing" && (
            <div className="bg-white p-6 rounded-md shadow">
              <AddServicing addNewService={addNewService} />
            </div>
          )}

          {/* Service Centers */}
          {activeSection === "servicecenters" && (
            <div className="bg-white p-6 rounded-md shadow">
              <AddServiceCenter onAddServiceCenter={addNewServiceCenter} />
            </div>
          )}

          {/* Profile */}
          {activeSection === "profile" && (
            <div className="bg-white p-6 rounded-md shadow">
              <Profile profile={user} updateProfile={() => {}} />
            </div>
          )}

          {/* Chat */}
          {activeSection === "chat" && (
            <div className="bg-white p-6 rounded-md shadow">
              <ChatPage setActiveSection={setActiveSection} previousSection={previousSection} />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

// Helper for stat cards
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-md shadow">
    <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default ManagerDashboard;
