import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star,} from 'lucide-react';
import { get_appointments, logout } from "../endpoints/api";
import carImage from "../assets/car1.webp";



const Landing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Fetch appointments if authenticated
    if (token) {
      fetchAppointments();
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const appointmentsData = await get_appointments();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const features = [
    {
      title: 'Easy Booking',
      description: 'Book your car service with just a few clicks',
      icon: '📅'
    },
    {
      title: 'Real-time Updates',
      description: 'Track your car service status in real-time',
      icon: '⚡'
    },
    {
      title: 'AI Assistant',
      description: 'Get intelligent suggestions for your car maintenance',
      icon: '🤖'
    }
  ];

  const serviceCards = [
    {
      title: 'Premium Auto Care',
      image: '/api/placeholder/400/250',
      description: 'Professional car servicing',
      rating: 4.8
    },
    {
      title: 'Quick Service Pro',
      image: '/api/placeholder/400/250',
      description: 'Fast and reliable service',
      rating: 4.9
    },
    {
      title: 'Tech Auto Hub',
      image: '/api/placeholder/400/250',
      description: 'Advanced auto tech services',
      rating: 4.7
    }
  ];

  const testimonials = [
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Great service! My car was fixed quickly and professionally.',
      avatar: '/api/placeholder/40/40'
    },
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Very reliable and efficient. Highly recommended!',
      avatar: '/api/placeholder/40/40'
    },
    {
      name: 'David Williams',
      rating: 5,
      comment: 'Excellent customer service and quality work.',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const gradientButtonStyle = {
    background: 'linear-gradient(to right, #E8B65A, #524CAD)',
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      nav('/login');
    }
  };

  const handleLogin = () => {
    nav('/login');
  };

  const handleSignup = () => {
    nav('/register');
  };

  const Navbar = ({ isAuthenticated }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const nav = useNavigate();

    const keywords = [
        "Oil Change",
        "Brake Inspection",
        "Engine Diagnostics",
        "Battery Replacement",
        "Tire Rotation",
        "Wheel Alignment",
        "Transmission Service",
        "Air Filter Change",
        "Car Wash",
        "Interior Cleaning",
    ];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter suggestions based on user input
        if (value.length > 0) {
            const filteredSuggestions = keywords.filter((keyword) =>
                keyword.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };



  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
            {/* Logo */}
            <div className="text-xl font-bold cursor-pointer" onClick={() => nav("/")}>
                🚗 AutoCare
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6">
                <button onClick={() => nav("/")} className="text-gray-600 hover:text-gray-900">Home</button>
                <button onClick={() => nav("/appointment")} className="text-gray-600 hover:text-gray-900">Services</button>
                <button onClick={() => nav("/contact")} className="text-gray-600 hover:text-gray-900">Contact Us</button>
                <div className="w-6"></div> {/* Added space between Contact Us and Search */}
                
                {/* Search Bar with Suggestions */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for services..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="px-4 py-2 w-72 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute left-0 mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        setSearchTerm(suggestion);
                                        setSuggestions([]);
                                        nav(`/search?query=${suggestion}`);
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Auth Section */}
            <div>
                {isAuthenticated ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            My Account
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <button onClick={() => nav("/profile")} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Profile
                                </button>
                                <button onClick={() => nav("/appointments")} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    My Appointments
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-x-4">
                        <button onClick={() => nav("/login")} className="text-blue-600 hover:underline">
                            Login
                        </button>
                        <button onClick={() => nav("/signup")} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-between px-6 py-16 bg-gray-50">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4">
            Your Car Service,{' '}
            <span className="text-blue-600">Simplified</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Book your car service in minutes, get real-time updates, and enjoy peace
            of mind with our trusted service network.
          </p>
          <button 
            style={gradientButtonStyle}
            className="px-6 py-3 text-white rounded-lg hover:opacity-95 transition-opacity"
            onClick={isAuthenticated ? () => nav('/book-service') : handleLogin}
          >
            {isAuthenticated ? 'Book Service' : 'Get Started'}
          </button>
        </div>
        <div className="hidden md:block">
          <img
            src={carImage}
            alt="Luxury car service"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* Appointments Section - Only shown when authenticated */}
      {isAuthenticated && (
        <div className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Your Appointments</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {appointments.length > 0 ? (
                <div className="grid gap-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{appointment.description}</h3>
                        <span className="text-gray-500">{appointment.date}</span>
                      </div>
                      <div className="mt-2 text-gray-600">
                        Service Center: {appointment.serviceCenter}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No appointments scheduled.</p>
                  <button
                    style={gradientButtonStyle}
                    className="mt-4 px-6 py-2 text-white rounded-lg hover:opacity-95 transition-opacity"
                    onClick={() => nav('/book-service')}
                  >
                    Book Your First Service
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose AutoCare
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Centers Section */}
      <div className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Service Centers
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {serviceCards.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-600">{service.rating}</span>
                  </div>
                  <button 
                    style={gradientButtonStyle}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-95 transition-opacity"
                    onClick={isAuthenticated ? () => nav('/book-service') : handleLogin}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-[#E8B65A] to-[#524CAD] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Experience Better Car Service?
        </h2>
        <p className="mb-8">Join thousands of satisfied customers using AutoCare</p>
        <button 
          className="px-8 py-3 bg-white text-[#524CAD] rounded-lg hover:bg-gray-100 transition-colors"
          onClick={isAuthenticated ? () => nav('/book-service') : handleSignup}
        >
          Get Started Now
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🚗 AutoCare</h3>
            <p className="text-gray-400">
              Making car service simple and reliable
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Services</li>
              <li>About Us</li>
              <li>Contact</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Oil Change</li>
              <li>Brake Service</li>
              <li>Tire Rotation</li>
              <li>Diagnostics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect with Us</h4>
            <div className="flex space-x-4 text-gray-400">
              <span>Twitter</span>
              <span>Facebook</span>
              <span>Instagram</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 AutoCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};}

export default Landing;