import { Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/landing.jsx"; 
import NotFound from "./pages/not_found"; 
import SignupForm from "./pages/signup.jsx";
import Login from "./routes/login.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
