import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`${API_BASE_URL}/account/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put(
      `${API_BASE_URL}/account/profile/`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const fetchFavorites = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`${API_BASE_URL}/services/favourites/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};