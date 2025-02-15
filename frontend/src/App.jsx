import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/landing.jsx'; // Example: Import a home page component?
import NotFound from './pages/not_found'; // Example: A 404 error page component
import SignupForm from './pages/signup.jsx';
import Login from './routes/login';


function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for your pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for undefined pages */}
      </Routes>
    </Router>
  );
}

export default App;
