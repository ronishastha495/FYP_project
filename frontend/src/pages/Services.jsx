import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BookingForm from '../pages/Booking';
import { getServices, getVehicles } from '../api/services';

// Sample logos (replace with actual image URLs or SVGs)
const brandLogos = [
  { name: 'Maruti', logo: 'https://via.placeholder.com/50?text=Maruti' },
  { name: 'Tata', logo: 'https://via.placeholder.com/50?text=Tata' },
  { name: 'Kia', logo: 'https://via.placeholder.com/50?text=Kia' },
];

const Services = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [favorites, setFavorites] = useState([]);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, vehiclesData] = await Promise.all([getServices(), getVehicles()]);
        setServices(servicesData);
        setVehicles(vehiclesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      let filteredServices = [...services];
      let filteredVehicles = [...vehicles];

      // Search Filter with Suggestions
      if (searchQuery) {
        filteredServices = filteredServices.filter((service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filteredVehicles = filteredVehicles.filter((vehicle) =>
          `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Generate Suggestions
        const allItems = [
          ...services.map((s) => s.name),
          ...vehicles.map((v) => `${v.make} ${v.model}`),
        ];
        setSuggestions(
          allItems.filter((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5)
        );
      } else {
        setSuggestions([]);
      }

      // Location Filter
      if (filterLocation) {
        filteredServices = filteredServices.filter((service) =>
          service.location?.toLowerCase().includes(filterLocation.toLowerCase())
        );
        filteredVehicles = filteredVehicles.filter((vehicle) =>
          vehicle.location?.toLowerCase().includes(filterLocation.toLowerCase())
        );
      }

      // Category Filter
      if (filterCategory !== 'all') {
        filteredServices = filterCategory === 'servicing' ? filteredServices : [];
        filteredVehicles = filterCategory === 'vehicles' ? filteredVehicles : [];
      }

      // Sorting
      if (sortOption === 'priceHighToLow') {
        filteredServices.sort((a, b) => b.cost - a.cost);
        filteredVehicles.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'rating') {
        filteredServices.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        filteredVehicles.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setServices(filteredServices);
      setVehicles(filteredVehicles);
    }
  }, [searchQuery, filterLocation, filterCategory, sortOption, loading]);

  const handleBookAppointment = (item) => {
    setSelectedService(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setIsFormOpen(false);
  };

  const toggleFavorite = (id, type) => {
    setFavorites((prev) =>
      prev.includes(`${type}-${id}`)
        ? prev.filter((fav) => fav !== `${type}-${id}`)
        : [...prev, `${type}-${id}`]
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gray-200 h-96 flex items-center justify-center">
          <img
            src="/assets/serviceimg.jpg" // Sample image (replace with actual image path)
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              What's trending? Check out the most sought-after cars
            </h1>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex">
          {/* Filter Sidebar */}
          <aside className="w-64 p-6 bg-white shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Filter & Sort</h3>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-gray-700 mb-2 font-medium">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-2 hover:bg-indigo-100 cursor-pointer transition duration-200"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">City</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  <option value="">Select City</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  <option value="all">All</option>
                  <option value="servicing">Servicing</option>
                  <option value="vehicles">Vehicles</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Sort By</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  <option value="default">Default</option>
                  <option value="priceHighToLow">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Best Cars Section */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Best Cars</h2>
              <p className="text-gray-600">
                There are 18 cars available in India, among which popular car models include XUV700, Scorpio N, Thar ROXX, Nexon, Thar & many more. The top Indian car brands are Mahindra, Tata. Explore the list of best car prices in India and compare cars to find the right car for you.
              </p>
              <button className="mt-4 text-indigo-600 hover:underline transition duration-200">
                Read More
              </button>
            </section>

            {/* Popular Cars by Brand */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Cars by Brand</h2>
              <div className="flex space-x-6">
                {brandLogos.map((brand) => (
                  <div key={brand.name} className="flex flex-col items-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 object-contain transform hover:scale-110 transition-transform duration-300"
                    />
                    <p className="mt-2 text-gray-700">{brand.name}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Car Repairing Insights */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Car Repairing Insights</h2>
              <p className="text-gray-600">
                Regular maintenance is key to keeping your car in top condition. Popular services include oil changes, tire rotations, and brake repairs. On average, a full car service can cost between $50 to $200 depending on the vehicle and location. Book a service today to ensure your car runs smoothly!
              </p>
            </section>

            {/* Servicing Section */}
            {filterCategory !== 'vehicles' && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Repair Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                    >
                      <img
                        src={service.image || 'https://via.placeholder.com/300'}
                        alt={service.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                          <button
                            onClick={() => toggleFavorite(service.id, 'service')}
                            className="text-gray-500 hover:text-red-500 transition duration-200"
                          >
                            {favorites.includes(`service-${service.id}`) ? '❤️' : '🤍'}
                          </button>
                        </div>
                        <p className="text-gray-600 mt-2">{service.description}</p>
                        <p className="text-indigo-600 font-medium mt-2">${service.cost}</p>
                        <div className="mt-2 flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-gray-700">{service.rating || 'N/A'} (Reviews: {service.reviews?.length || 0})</span>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-500 h-2.5 rounded-full"
                              style={{ width: `${service.availability || 70}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Availability: {service.availability || 70}%</p>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">Feedback: {service.feedback || 'No feedback yet'}</p>
                        </div>
                        <button
                          onClick={() => handleBookAppointment(service)}
                          className="w-full mt-4 px-4 py-2 text-white rounded-md hover:opacity-95 transition-opacity cursor-pointer"
                          style={{ background: 'linear-gradient(to right, #E8B65A, #524CAD)' }}
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vehicles for Purchase Section */}
            {filterCategory !== 'servicing' && (
              <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Vehicles for Purchase</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                    >
                      <img
                        src={vehicle.image || 'https://via.placeholder.com/300'}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold text-gray-800">{`${vehicle.make} ${vehicle.model} (${vehicle.year})`}</h3>
                          <button
                            onClick={() => toggleFavorite(vehicle.id, 'vehicle')}
                            className="text-gray-500 hover:text-red-500 transition duration-200"
                          >
                            {favorites.includes(`vehicle-${vehicle.id}`) ? '❤️' : '🤍'}
                          </button>
                        </div>
                        <p className="text-gray-600 mt-2">VIN: {vehicle.vin}</p>
                        <p className="text-indigo-600 font-medium mt-2">${vehicle.price || 'N/A'}</p>
                        <div className="mt-2 flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-gray-700">{vehicle.rating || 'N/A'} (Reviews: {vehicle.reviews?.length || 0})</span>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-500 h-2.5 rounded-full"
                              style={{ width: `${vehicle.stock || 50}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Stock: {vehicle.stock || 50}%</p>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">Feedback: {vehicle.feedback || 'No feedback yet'}</p>
                        </div>
                        <button
                          onClick={() => handleBookAppointment({ ...vehicle, name: `${vehicle.make} ${vehicle.model}` })}
                          className="w-full mt-4 px-4 py-2 text-white rounded-md hover:opacity-95 transition-opacity cursor-pointer"
                          style={{ background: 'linear-gradient(to right, #E8B65A, #524CAD)' }}
                        >
                          Inquire Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Booking Form Modal */}
      {isFormOpen && (
        <BookingForm
          service={selectedService}
          vehicles={vehicles}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      <Footer />
    </div>
  );
};

export default Services;