import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/userApi';
import bookingService from '../api/bookingService'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile and favorites
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const [userData, favoritesData] = await Promise.all([
          fetchUserProfile(),
          bookingService.getUserFavorites ? bookingService.getUserFavorites() : []
        ]);
        setUser(userData);
        setFavorites(favoritesData);
      } catch (err) {
        const errorMsg = err.error || 'Failed to load user data';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const updatedUser = await fetchUserProfile.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (err) {
      const errorMsg = err.error || 'Failed to update profile';
      toast.error(errorMsg);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setFavorites([]);
    toast.success('Logged out successfully');
  };

  // Toggle favorite
  const toggleFavorite = async (type, itemId) => {
    try {
      const result = await bookingService.toggleFavorite ? bookingService.toggleFavorite(type, itemId) : { added: false, favorite: null }
      setFavorites((prev) => {
        if (result.added) {
          return [...prev, result.favorite];
        } else {
          return prev.filter((fav) => fav.id !== itemId);
        }
      });
      toast.success(result.added ? 'Added to favorites' : 'Removed from favorites');
      return result;
    } catch (err) {
      const errorMsg = err.error || 'Failed to update favorites';
      toast.error(errorMsg);
      throw err;
    }
  };

  // Refresh favorites
  const refreshFavorites = async () => {
    try {
      const favoritesData = await bookingService.getUserFavorites ? bookingService.getUserFavorites() : []
      setFavorites(favoritesData);
      return favoritesData;
    } catch (err) {
      const errorMsg = err.error || 'Failed to load favorites';
      toast.error(errorMsg);
      return [];
    }
  };

  // Check if an item is favorited
  const checkIsFavorite = async (type, itemId) => {
    try {
      return await bookingService.checkIsFavorite ? bookingService.checkIsFavorite(type, itemId) : false
    } catch (err) {
      const errorMsg = err.error || 'Failed to check favorite status';
      toast.error(errorMsg);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        favorites,
        loading,
        error,
        updateUser,
        logout,
        toggleFavorite,
        refreshFavorites,
        checkIsFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);