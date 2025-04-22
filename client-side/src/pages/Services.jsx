import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useBooking } from '../contexts/BookingContext';
import { useUser } from '../contexts/UserContext';
import bookingService from '../api/bookingService'; // Updated to bookingService
import { toast } from 'react-toastify';
import serviceImg from '../assets/serviceimg.jpg';
import hyundaiLogo from '../assets/hyundai.webp';
import toyotaLogo from '../assets/toyota.webp';
import bmwLogo from '../assets/bmw.jpeg';
import fordLogo from '../assets/ford.webp';
import mercedesLogo from '../assets/mer.jpeg';
import hondaLogo from '../assets/honda.jpg';

const brandLogos = [
  { name: 'Hyundai', logo: hyundaiLogo },
  { name: 'Toyota', logo: toyotaLogo },
  { name: 'BMW', logo: bmwLogo },
  { name: 'Ford', logo: fordLogo },
  { name: 'Mercedes', logo: mercedesLogo },
  { name: 'Honda', logo: hondaLogo },
];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [rawServices, setRawServices] = useState([]);
  const [rawVehicles, setRawVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const { selectServiceForBooking, selectVehicleForBooking } = useBooking();
  const { favorites, toggleFavorite } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, vehiclesData] = await Promise.all([
          bookingService.getServices(), // Updated to bookingService
          bookingService.getDealershipVehicles(),
        ]);
        setRawServices(servicesData);
        setRawVehicles(vehiclesData);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.error || 'Failed to load data'; // Line ~54
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { filteredServices, filteredVehicles } = useMemo(() => {
    let filteredServices = [...rawServices];
    let filteredVehicles = [...rawVehicles];

    if (searchQuery) {
      filteredServices = filteredServices.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filteredServices = filterCategory === 'servicing' ? filteredServices : [];
      filteredVehicles = filterCategory === 'vehicles' ? filteredVehicles : [];
    }

    if (sortOption === 'priceHighToLow') {
      filteredServices = [...filteredServices].sort((a, b) => (b.cost || 0) - (a.cost || 0));
      filteredVehicles = [...filteredVehicles].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return { filteredServices, filteredVehicles };
  }, [searchQuery, filterCategory, sortOption, rawServices, rawVehicles]);

  useEffect(() => {
    if (searchQuery) {
      const allItems = [
        ...rawServices.map((s) => s.name),
        ...rawVehicles.map((v) => `${v.make} ${v.model}`),
      ];
      setSuggestions(
        allItems
          .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, rawServices, rawVehicles]);

  const handleBookAppointment = (item, type) => {
    if (type === 'service') {
      selectServiceForBooking(item);
    } else if (type === 'vehicle') {
      selectVehicleForBooking(item);
    }
    navigate('/booking');
  };

  const handleToggleFavorite = async (id, type) => {
    try {
      await bookingService.toggleFavorite(type, id); // Updated to bookingService
      toast.success(`Favorite ${type} updated!`);
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const isFavorite = (id, type) => {
    return favorites.some(
      (fav) => fav.type === type && (type === 'service' ? fav.service : fav.vehicle) === id
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openQuickView = (item, type) => {
    setSelectedItem({ ...item, type });
  };

  const closeQuickView = () => {
    setSelectedItem(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-2xl text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-16">
        <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
          <img
            src={serviceImg}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg"
            >
              Discover Trending Cars & Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-lg text-gray-200"
            >
              Explore top vehicles and repair services tailored for you.
            </motion.p>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row container mx-auto px-4 py-8 gap-6">
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-2xl transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 lg:mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Filter & Sort</h3>
                <button className="lg:hidden text-gray-600 dark:text-gray-300" onClick={toggleSidebar}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search services or vehicles..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg mt-2 shadow-lg max-h-48 overflow-y-auto"
                      >
                        {suggestions.map((suggestion, index) => (
                          <motion.li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-pointer text-gray-800 dark:text-gray-100 transition"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            {suggestion}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                  >
                    <option value="all">All</option>
                    <option value="servicing">Servicing</option>
                    <option value="vehicles">Vehicles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                  >
                    <option value="default">Default</option>
                    <option value="priceHighToLow">Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <button
            className="lg:hidden fixed top-20 right-4 z-50 p-2 bg-indigo-600 text-white rounded-full shadow-lg"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <main className="flex-1 p-6">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && (
              <>
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Top Picks in Vehicles
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Discover 18 premium cars available in India, including models like XUV700, Scorpio N,
                    Thar ROXX, Nexon, and more. Explore top brands like Mahindra and Tata to find your
                    perfect ride.
                  </p>
                  <button className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline transition">
                    Explore More
                  </button>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Popular Brands
                  </h2>
                  <div className="flex flex-wrap gap-6">
                    {brandLogos.map((brand) => (
                      <div key={brand.name} className="flex flex-col items-center">
                        <motion.img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-16 h-16 object-contain rounded-full shadow-md"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        />
                        <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">{brand.name}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Maintenance Insights
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Keep your vehicle in top shape with regular maintenance. Popular services include oil
                    changes, tire rotations, and brake repairs, costing $50-$200 depending on your vehicle
                    and location.
                  </p>
                </motion.section>

                {filterCategory !== 'vehicles' && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                  >
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                      Repair Services
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredServices.map((service) => (
                        <motion.div
                          key={service.service_id || service.id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                          whileHover={{ y: -5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <img
                            src={service.image || 'https://via.placeholder.com/300'}
                            alt={service.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {service.name}
                              </h3>
                              <motion.button
                                onClick={() => handleToggleFavorite(service.service_id || service.id, 'service')}
                                whileTap={{ scale: 0.8 }}
                                className="text-gray-500 dark:text-gray-300"
                              >
                                {isFavorite(service.service_id || service.id, 'service') ? (
                                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                  </svg>
                                ) : (
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                )}
                              </motion.button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                              {service.description}
                            </p>
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                              ${service.cost || 'N/A'}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBookAppointment(service, 'service')}
                                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition"
                              >
                                Book Now
                              </button>
                              <button
                                onClick={() => openQuickView(service, 'service')}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              >
                                Quick View
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {filterCategory !== 'servicing' && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                      Vehicles for Purchase
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredVehicles.map((vehicle) => (
                        <motion.div
                          key={vehicle.vehicle_id || vehicle.id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                          whileHover={{ y: -5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <img
                            src={vehicle.image || 'https://via.placeholder.com/300'}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
                              </h3>
                              <motion.button
                                onClick={() => handleToggleFavorite(vehicle.vehicle_id || vehicle.id, 'vehicle')}
                                whileTap={{ scale: 0.8 }}
                                className="text-gray-500 dark:text-gray-300"
                              >
                                {isFavorite(vehicle.vehicle_id || vehicle.id, 'vehicle') ? (
                                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                  </svg>
                                ) : (
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                )}
                              </motion.button>
                            </div>
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                              ${vehicle.price || 'N/A'}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBookAppointment(vehicle, 'vehicle')}
                                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition"
                              >
                                Inquire Now
                              </button>
                              <button
                                onClick={() => openQuickView(vehicle, 'vehicle')}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              >
                                Quick View
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {selectedItem.type === 'service'
                    ? selectedItem.name
                    : `${selectedItem.make} ${selectedItem.model} (${selectedItem.year})`}
                </h2>
                <button
                  onClick={closeQuickView}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img
                src={selectedItem.image || 'https://via.placeholder.com/300'}
                alt={selectedItem.name || `${selectedItem.make} ${selectedItem.model}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              {selectedItem.type === 'service' ? (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedItem.description}</p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                    ${selectedItem.cost || 'N/A'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedItem.make} {selectedItem.model} ({selectedItem.year})
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                    ${selectedItem.price || 'N/A'}
                  </p>
                </>
              )}
              <button
                onClick={() => handleBookAppointment(selectedItem, selectedItem.type)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition"
              >
                {selectedItem.type === 'service' ? 'Book Appointment' : 'Inquire Now'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Services;
