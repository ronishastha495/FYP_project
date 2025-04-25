import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import backgroundImage from "../../assets/background.jpg";
import { useAuth } from "../../contexts/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const {
    login_user: contextLogin,
    isAuthenticated,
    isLoading: authLoading,
    role,
    user,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && !authChecked) {
      if (isAuthenticated) {
        redirectBasedOnRole();
      }
      setAuthChecked(true);
    }
  }, [isAuthenticated, authLoading, authChecked]);

  useEffect(() => {
    if (user) {
      console.log("user has been updated to:", user);
    }
  }, [user]);

  useEffect(() => {
    if (role && isAuthenticated && authChecked) {
      console.log("role has been updated to:", role);
      redirectBasedOnRole();
    }
  }, [role, isAuthenticated, authChecked]);

  const redirectBasedOnRole = () => {
    console.log("Redirecting based on role:", role);
    console.log("Authentication status:", isAuthenticated);
    console.log("Auth checked status:", authChecked);

    if (role === "service_manager") {
      console.log("REDIRECTING TO /manager");
      navigate("/manager");
      toast.success("Welcome back, Manager!");
    } else {
      console.log("REDIRECTING TO /");
      navigate("/");
      toast.success("Welcome back!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formSubmitting) return;

    setFormSubmitting(true);

    try {
      const response = await contextLogin(formData.username, formData.password);
      console.log("Login response:", response);
      if (!response) {
        throw new Error("No response received from server");
      }
      toast.success("Logged in successfully!");
      setFormSubmitting(false);
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setFormSubmitting(false);
    }
  };

  if (authLoading && !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to AutoCare
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              disabled={formSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                required
                autoComplete="current-password"
                disabled={formSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={formSubmitting}
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
            disabled={formSubmitting}
            style={{
              background: "linear-gradient(to right, #E8B65A, #524CAD)",
            }}
            className={`w-full px-4 py-2 text-white rounded-lg hover:opacity-95 transition-opacity ${
              formSubmitting ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {formSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-500 hover:text-amber-600 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;