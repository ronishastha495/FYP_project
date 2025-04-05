import { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, getUserDetails, uploadProfilePicture } from "../api/userProfile";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const [profileData, userData] = await Promise.all([
        getUserProfile(),
        getUserDetails()
      ]);
      setProfile({
        ...profileData,
        username: userData.username,
        email: userData.email
      });
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(profileData);
      setProfile(updatedProfile);
      setError(null);
      return updatedProfile;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      console.error("Error updating profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const uploadProfilePicture = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profile_picture', file);
      const updatedProfile = await uploadProfilePicture(formData);
      setProfile(updatedProfile);
      setError(null);
      return updatedProfile;
    } catch (err) {
      setError(err.message || "Failed to upload profile picture");
      console.error("Error uploading profile picture:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile: fetchProfile,
        uploadProfilePicture,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);