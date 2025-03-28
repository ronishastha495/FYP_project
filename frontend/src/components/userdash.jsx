import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    address: "",
    city: "",
    country: "",
    bio: "",
    profile_picture: ""
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/account/profile/", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/account/profile/", profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="address"
          placeholder="Address"
          value={profile.address}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={profile.city}
          onChange={handleChange}
        />
        <input
          name="country"
          placeholder="Country"
          value={profile.country}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserProfile;
