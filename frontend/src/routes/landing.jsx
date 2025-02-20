import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_appointments, logout } from "../endpoints/api";

const Landing = () => {
    const [appointments, setAppointments] = useState([]); // State to store fetched appointments
    const nav = useNavigate(); // Hook for navigation

    // Fetch appointments when the component mounts
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const appointmentsData = await get_appointments();
                setAppointments(appointmentsData);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
        fetchAppointments();
    }, []);

    // Handle logout function
    const handleLogout = async () => {
        const success = await logout(); // Call API to log out
        if (success) {
            nav('/login'); // Redirect to login page after successful logout
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, User!</h1>
            
            {/* Display list of appointments */}
            <div className="mt-4 w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Your Appointments</h2>
                {appointments.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {appointments.map((appointment, index) => (
                            <li key={index} className="text-gray-600">{appointment.description}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No appointments available.</p>
                )}
            </div>
            
            {/* Logout Button */}
            <button 
                onClick={handleLogout} 
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
};

export default Landing;
