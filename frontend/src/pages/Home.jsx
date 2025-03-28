import React from 'react';
import { Car, Search, Bell, Calendar, DollarSign, User, Wrench, Clock } from 'lucide-react';
import backgroundImage from '../assets/background.jpg';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Services from './Services';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section
        id="home"
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative pt-16"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">Your Car Service, Simplified</h1>
          <p className="text-lg mb-6">
            Book, track, and manage your car maintenance with ease.
          </p>
          <a
            href="/services"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose AutoCare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <User className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600">Safe login for users and admins.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Search className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">Find services with advanced filters.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Bell className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Notifications</h3>
              <p className="text-gray-600">Real-time updates and chat support.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Calendar className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reminders</h3>
              <p className="text-gray-600">Automated reminders for maintenance.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <DollarSign className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transparent Costing</h3>
              <p className="text-gray-600">Accurate cost estimates upfront.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Clock className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tracking</h3>
              <p className="text-gray-600">Track appointments with ease.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Your Personalized Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Wrench className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vehicle Details</h3>
              <p className="text-gray-600">Manage your vehicle details.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Car className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Servicing History</h3>
              <p className="text-gray-600">Track your service history.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-600 italic mb-4">"Easy scheduling!"</p>
              <p className="font-semibold text-gray-800">John D.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-600 italic mb-4">"Transparent pricing!"</p>
              <p className="font-semibold text-gray-800">Sarah M.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-600 italic mb-4">"Great search feature!"</p>
              <p className="font-semibold text-gray-800">David W.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-indigo-50 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Better Car Care?</h2>
          <p className="text-lg mb-6">Join thousands of satisfied customers.</p>
           <a
              href="/services"
              className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ background: 'linear-gradient(to right, #E8B65A, #524CAD)', color: 'white' }}
            >
            Get Started Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;