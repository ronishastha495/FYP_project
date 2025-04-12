import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const FAVORITES_URL = `${API_BASE_URL}/services/favourites/`;

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Fetch all favorites for the current user
export const fetchFavorites = async () => {
  try {
    const response = await axios.get(FAVORITES_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Add a service to favorites
export const addServiceToFavorites = async (serviceId) => {
  try {
    // Get user ID from localStorage - first try userId directly, then fallback to user object
    const userId = localStorage.getItem('userId') || 
                  (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null);
    
    if (!userId) {
      throw new Error('User ID not found. Please log in again.');
    }
    
    const favoriteData = {
      type: 'service',
      service: serviceId,
      user: userId
    };
    console.log('Sending service favorite data:', favoriteData);
    const response = await axios.post(FAVORITES_URL, favoriteData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error adding service to favorites:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Add a vehicle to favorites
export const addVehicleToFavorites = async (vehicleId) => {
  try {
    // Get user ID from localStorage - first try userId directly, then fallback to user object
    const userId = localStorage.getItem('userId') || 
                 (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null);
    
    if (!userId) {
      throw new Error('User ID not found. Please log in again.');
    }
    
    const favoriteData = {
      type: 'vehicle',
      vehicle: vehicleId,
      user: userId
    };
    console.log('Sending favorite data:', favoriteData);
    const response = await axios.post(FAVORITES_URL, favoriteData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle to favorites:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Remove a favorite by ID
export const removeFavorite = async (favoriteId) => {
  try {
    const response = await axios.delete(`${FAVORITES_URL}${favoriteId}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

// Check if an item is in favorites
export const checkIsFavorite = async (type, itemId) => {
  try {
    // Ensure type is lowercase to match backend expectations
    const normalizedType = type.toLowerCase();
    
    const favorites = await fetchFavorites();
    return favorites.some(fav => 
      fav.type === normalizedType && 
      (normalizedType === 'service' ? fav.service === itemId : fav.vehicle === itemId)
    );
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Toggle favorite status (add if not in favorites, remove if already in favorites)
export const toggleFavorite = async (type, itemId) => {
  try {
    // Ensure type is lowercase to match backend expectations
    const normalizedType = type.toLowerCase();
    
    const favorites = await fetchFavorites();
    const existingFavorite = favorites.find(fav => 
      fav.type === normalizedType && 
      (normalizedType === 'service' ? fav.service === itemId : fav.vehicle === itemId)
    );

    if (existingFavorite) {
      // Remove from favorites
      await removeFavorite(existingFavorite.id);
      return { added: false, favorite: null };
    } else {
      // Add to favorites
      const newFavorite = normalizedType === 'service' 
        ? await addServiceToFavorites(itemId)
        : await addVehicleToFavorites(itemId);
      return { added: true, favorite: newFavorite };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};