import React from "react";
import { Link } from "react-router-dom";

const not_found = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        {/* 404 Glitch Effect */}
        <h1 className="text-9xl font-extrabold glitch text-red-600">404</h1>
        <p className="text-2xl mt-2">Oops! Page Not Found</p>
        <p className="text-gray-400 mt-4">The page you are looking for does not exist.</p>

        {/* Go Back Button */}
        <Link to="/" className="mt-6 inline-block px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default not_found;
