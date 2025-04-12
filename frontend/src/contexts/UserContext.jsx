import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile, fetchFavorites } from '../api/userApi'; // Adjust path as needed

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileData = await fetchUserProfile();
        setProfile(profileData);

        // Fetch favorites data
        const favoritesData = await fetchFavorites();
        setFavorites(favoritesData);

        // For appointments and reminders, you could add API calls here if endpoints exist
        // For now, we'll use dummy data as placeholders
        setAppointments([
          {
            id: 1,
            vehicle: "Toyota Camry",
            service: "Oil Change",
            date: "2024-10-05",
            price: 50,
            status: "Confirmed",
          },
          {
            id: 2,
            vehicle: "Honda Civic",
            service: "Brake Repair",
            date: "2024-10-07",
            price: 150,
            status: "Pending",
          },
        ]);

        setReminders([
          { id: 1, message: "Oil Change due for Toyota Camry", date: "2024-10-05" },
          { id: 2, message: "Tire Alignment check for Honda Civic", date: "2024-10-10" },
        ]);
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ 
      appointments, 
      reminders, 
      profile, 
      favorites, 
      loading, 
      error 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);