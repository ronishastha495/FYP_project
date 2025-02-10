import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import bgImage from '../assets/background.jpg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="min-h-screen w-full flex items-center  bg-gray-100">
      <div 
        className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Join our community today
          </p>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>  
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              style={{
                background: `linear-gradient(to right, #E8B65A, #524CAD)`
              }}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#524CAD]"
            >
              Sign Up
            </button>
          </form>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" className="font-medium text-[#524CAD] hover:text-opacity-80">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;