import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import backgroundImage from '../../assets/background.jpg';
import { useAuth } from '../../contexts/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../api/auth'; // Import direct API function
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login_user: contextLogin } = useAuth(); // Get login from context

  // Use context login if available, otherwise fallback to direct API
  const loginUser = contextLogin || apiLogin;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Login attempt with:', formData); // Debug

    try {
      const response = await loginUser(formData.username, formData.password);
      console.log('Login response:', response); // Debug

      if (!response) {
        throw new Error('No response received from server');
      }

      // Handle role-based navigation
      const role = response.user?.role || response.role;
      console.log('User role:', role); // Debug

      if (role === 'service_manager') {
        navigate('/manager');
        toast.success('Welcome, Manager!');
      } else {
        navigate('/');
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });

      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Handle Django error responses
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error.response.data) {
          errorMessage = Object.values(error.response.data).join(' ') || errorMessage;
        }
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error - please check your connection';
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to AutoCare</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ background: 'linear-gradient(to right, #E8B65A, #524CAD)' }}
            className={`w-full px-4 py-2 text-white rounded-lg hover:opacity-95 transition-opacity ${
              isLoading ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-500 hover:text-amber-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;