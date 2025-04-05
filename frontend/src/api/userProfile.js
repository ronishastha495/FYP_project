import axiosInstance from './axiosConfig';


export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(`account/profile/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error.response?.data || { error: 'Failed to fetch user profile' };
  }
};

export const getUserDetails = async () => {
  try {
    const response = await axiosInstance.get(`account/user/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error.response?.data || { error: 'Failed to fetch user details' };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(
      `account/profile/`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error.response?.data || { error: 'Failed to update user profile' };
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await axiosInstance.post(
      `account/profile/picture/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error.response?.data || { error: 'Failed to upload profile picture' };
  }
};