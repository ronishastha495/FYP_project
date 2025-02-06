import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUp from './pages/signup'; // Import the signup page component
import Home from './pages/home'; // Example: Import a home page component
import NotFound from './pages/not_found'; // Example: A 404 error page component
import RegistrationPage from './pages/signup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for your pages */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<RegistrationPage/>} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for undefined pages */}
      </Routes>
    </Router>
  );
}

export default App;
