// src/components/user/UserLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Footer from "../common/Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 fixed h-full shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-white">eProduct</h2>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 transition-colors duration-200 ${
                  isActive ? "text-blue-200" : "hover:text-blue-200"
                }`
              }
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              </svg>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/appointments"
              className={({ isActive }) =>
                `flex items-center space-x-2 transition-colors duration-200 ${
                  isActive ? "text-blue-200" : "hover:text-blue-200"
                }`
              }
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v2H6V4zm0 4h8v8H6V8z" />
              </svg>
              <span>Appointments</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/profile"
              className={({ isActive }) =>
                `flex items-center space-x-2 transition-colors duration-200 ${
                  isActive ? "text-blue-200" : "hover:text-blue-200"
                }`
              }
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;