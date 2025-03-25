import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export const UserDashboard = () => { // Changed to named export
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    location: 'New York, NY',
    profilePic: null,
  });
  const [profilePic, setProfilePic] = useState(null);
  const [favorites, setFavorites] = useState(['Haircut', 'Spa Package']);

  const bookings = [
    { id: 1, service: 'Haircut', date: '2025-03-25', status: 'Pending' },
    { id: 2, service: 'Massage', date: '2025-03-26', status: 'Confirmed' },
  ];
  const services = ['Haircut', 'Massage', 'Spa Package'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      setFormData({ ...formData, profilePic: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleRemoveFavorite = (fav) => {
    setFavorites(favorites.filter((item) => item !== fav));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50">
      <Navbar />
      <main className="flex-grow container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-extrabold text-center text-indigo-800 mb-12 tracking-wide drop-shadow-md">
          Customize Dashboard
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['profile', 'bookings', 'services', 'favorites', 'tracking'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-xl'
                  : 'bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white shadow-md'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-indigo-100">
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Update Profile</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-6">
                  <img
                    src={profilePic || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300 shadow-lg"
                  />
                  <label className="cursor-pointer bg-indigo-100 text-indigo-800 px-5 py-2 rounded-lg hover:bg-indigo-200 transition duration-300 font-medium">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 bg-gray-50"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 font-semibold shadow-lg"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
          {activeTab === 'bookings' && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Bookings</h3>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 mb-6 bg-indigo-50 rounded-xl hover:shadow-lg transition duration-300 border border-indigo-100"
                  >
                    <p className="text-gray-800">
                      <strong>Service:</strong> {booking.service}
                    </p>
                    <p className="text-gray-800">
                      <strong>Date:</strong> {booking.date}
                    </p>
                    <p
                      className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {booking.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-lg">No bookings found.</p>
              )}
            </div>
          )}
          {activeTab === 'services' && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Available Services</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <li
                    key={service}
                    className="p-5 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition duration-300 text-indigo-800 font-semibold shadow-sm"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'favorites' && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Favorites</h3>
              {favorites.length > 0 ? (
                favorites.map((fav) => (
                  <div
                    key={fav}
                    className="p-6 mb-6 bg-indigo-50 rounded-xl hover:shadow-lg transition duration-300 flex justify-between items-center border border-indigo-100"
                  >
                    <span className="text-gray-800 font-medium">{fav}</span>
                    <button
                      onClick={() => handleRemoveFavorite(fav)}
                      className="text-red-600 hover:text-red-800 font-semibold transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-lg">No favorites added.</p>
              )}
            </div>
          )}
          {activeTab === 'tracking' && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Track Appointments</h3>
              <p className="text-gray-600 text-lg mb-4">
                View and manage your appointment tracking here.
              </p>
              <Link
                to="/tracking"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold shadow-md"
              >
                Go to Tracking Page
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;