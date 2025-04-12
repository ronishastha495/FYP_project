import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/userApi';
import { fetchFavorites, toggleFavorite } from '../api/favoriteService';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await fetchFavorites();
      setFavorites(favoritesData);
      return favoritesData;
    } catch (err) {
      console.error('Error loading favorites:', err);
      return [];
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        // Fetch user profile data
        const userData = await fetchUserProfile();
        setUser(userData);
        
        // Fetch favorites data
        await loadFavorites();
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load user data');
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    // Additional logout logic if needed
  };

  const handleToggleFavorite = async (type, itemId) => {
    try {
      const result = await toggleFavorite(type, itemId);
      // Refresh favorites list
      await loadFavorites();
      return result;
    } catch (error) {
      toast.error('Failed to update favorites');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    updateUser,
    logout,
    favorites,
    toggleFavorite: handleToggleFavorite,
    refreshFavorites: loadFavorites
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);