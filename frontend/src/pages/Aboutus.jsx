import React from "react";
import Navbar from "../components/common/Navbar"; 
import Footer from "../components/common/Footer"; 
import backgroundImage from '../assets/background.jpg';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top edge */}
      <Navbar />

      {/* Main content with padding to create space below Navbar */}
      <div className="flex-grow container mx-auto pt-20 px-4 py-8 bg-white bg-opacity-90 rounded-lg my-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">About Us</h1>

        <section className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to <span className="font-semibold text-indigo-600">AutoCare</span>, your trusted partner in vehicle maintenance and automotive solutions. At AutoCare, we are passionate about keeping your vehicle in top condition, whether it’s through expert servicing, high-quality repairs, or helping you find the perfect car to suit your needs.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Founded in 2025, AutoCare has grown from a small family-owned garage to a leading automotive service provider with a network of skilled professionals across multiple locations. Our mission is simple: to deliver exceptional service, unmatched expertise, and a seamless experience for every customer. We combine state-of-the-art technology with a customer-first approach to ensure your vehicle receives the care it deserves.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Our team consists of certified technicians and automotive enthusiasts who bring years of experience to every job. Whether you’re booking a routine oil change, inquiring about a vehicle purchase, or seeking advice on maintenance, we’re here to help. We pride ourselves on transparency, affordability, and building long-lasting relationships with our clients.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            At AutoCare, we also believe in giving back to the community. We partner with local organizations to promote road safety and support automotive education programs for the next generation of mechanics. When you choose AutoCare, you’re not just choosing a service—you’re joining a family dedicated to excellence on and off the road.
          </p>

          <div className="text-center mt-8">
            <p className="text-xl font-semibold text-gray-800">
              Thank you for trusting us with your automotive needs!
            </p>
          </div>
        </section>
      </div>

      {/* Footer at the bottom edge */}
      <Footer />
    </div>
  );
};

export default AboutUs;