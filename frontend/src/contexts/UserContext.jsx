import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserDetails } from '../api/userProfile';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData);
        // TODO: Fetch appointments data here when implemented
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, appointments, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);