import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import BookingForm from '../pages/Booking';

const Services = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const navigate = useNavigate();

  const servicesData = [
    { 
      title: 'Oil Change', 
      description: 'Oil replacement, filter change, inspection', 
      price: 3500,
      rating: 4.5,
      reviews: 10,
    },
    { 
      title: 'Brake Repair', 
      description: 'Brake pad replacement, fluid check', 
      price: 9000,
      rating: 4.2,
      reviews: 8,
    },
    { 
      title: 'Tire Services', 
      description: 'Rotation, alignment, replacement', 
      price: 15750,
      rating: 4.7,
      reviews: 15,
    },
    { 
      title: 'Battery Services', 
      description: 'Check, charging, replacement', 
      price: 12750,
      rating: 4.0,
      reviews: 5,
    },
    { 
      title: 'Engine Diagnostics', 
      description: 'Error scanning, troubleshooting', 
      price: 4500,
      rating: 4.3,
      reviews: 12,
    },
    { 
      title: 'Suspension Repair', 
      description: 'Alignment, shock absorber', 
      price: 12500,
      rating: 4.1,
      reviews: 7,
    },
    { 
      title: 'Transmission Repair', 
      description: 'Fluid change, overhaul', 
      price: 101500,
      rating: 4.8,
      reviews: 20,
    },
    { 
      title: 'A/C Repair', 
      description: 'Recharge, blower repair', 
      price: 13750,
      rating: 4.4,
      reviews: 9,
    },
  ];

  const [services, setServices] = useState(servicesData);

  useEffect(() => {
    let filteredServices = [...servicesData];

    // Search filter
    if (searchQuery) {
      filteredServices = filteredServices.filter((service) =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filteredServices = filteredServices.filter((service) =>
        favorites.includes(service.title)
      );
    }

    // Sort
    if (sortOption === 'priceHighToLow') {
      filteredServices.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'alphabetical') {
      filteredServices.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'rating') {
      filteredServices.sort((a, b) => b.rating - a.rating);
    }

    setServices(filteredServices);
  }, [searchQuery, sortOption, showFavoritesOnly, favorites]);

  const handleBookAppointment = (service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    // Simulate API call or booking process
    try {
      console.log('Booking data:', { ...formData, service: selectedService.title });
      setIsFormOpen(false);
      alert('Booking successful!');
      // Optionally navigate to a confirmation page
      // navigate('/booking-confirmation');
    } catch (error) {
      alert('Error booking appointment: ' + error.message);
    }
  };

  const toggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title)
        ? prev.filter((fav) => fav !== title)
        : [...prev, title]
    );
  };

  const handleRating = (title, rating) => {
    setRatings((prev) => ({ ...prev, [title]: rating }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <aside className="w-64 p-4 bg-white shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Services</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="priceHighToLow">Price (High to Low)</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="rating">Rating (High to Low)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="mr-2"
              />
              <span className="text-gray-700">Show Favorites Only</span>
            </label>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Services: {services.length} found
            </h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300">
                List
              </button>
              <button className="px-4 py-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                Grid
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/300x200"
                    alt={service.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <button
                    onClick={() => toggleFavorite(service.title)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  >
                    {favorites.includes(service.title) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <p className="text-gray-800 font-bold">NPR {service.price.toLocaleString()}</p>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">{'★'.repeat(Math.floor(service.rating))}</span>
                    <span className="text-gray-600 ml-1">({service.rating} - {service.reviews} reviews)</span>
                  </div>
                  <div className="mb-2">
                    <label className="text-gray-700">Rate this service:</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(service.title, star)}
                          className={`text-2xl ${
                            (ratings[service.title] || 0) >= star ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookAppointment(service)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
      {isFormOpen && (
        <BookingForm
          service={selectedService}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default Services;