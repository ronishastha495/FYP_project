import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
// import { login } from "../endpoints/api.js";
import backgroundImage from '../assets/background.jpg';
import { useAuth } from '../contexts/useAuth';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  // const [error, setError] = useState(""); // New state to store login errors
  const { register_user } = useAuth();

  const handleRegister = () => {
    register_user(username, email, password, Cpassword)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div
        className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1 text-center">
           Create an account to Register
          </h2>
          {/* <p className="text-gray-500 text-sm text-center mb-6">
            Login to your account
          </p> */}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Show error */}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm text-gray-600 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
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

            <div>
              <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="Cpassword"
                  type={showPassword ? "text" : "Cpassword"}
                  value={Cpassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
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
              style={{
                background: 'linear-gradient(to right, #E8B65A, #524CAD)'
              }}
              className="w-full py-2.5 text-white rounded-lg mt-6 hover:opacity-95 transition-opacity"
            onClick={handleRegister}>
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-amber-500 hover:text-amber-600">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
