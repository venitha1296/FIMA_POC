import "../styles/style.scss";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file
import "bootstrap-icons/font/bootstrap-icons.css";
import ApiFinder from "../apis/ApiFinder";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    let tokenStatus = localStorage.getItem('tokenStatus')
    if (tokenStatus && tokenStatus !== 'login') {
      localStorage.removeItem('tokenStatus')
    }

  },)

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If there are errors, do not proceed with the API call
    if (validateForm()) {
      setIsLoading(true); // Start loading
      try {
        const response = await ApiFinder.post("/login", formData); // Your backend API endpoint for login

        if (response.status === 200) {
          // On successful signup, you can redirect to login or show a success message
          // Show success toast
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("tokenStatus", 'login');
          navigate("/dashboard"); // Redirect after success
        }
      } catch (error: any) {
        console.error("Login error:", error);
        // Use optional chaining to safely access the error message
        const errorMessage = error.response?.data?.message || "Login failed! Please try again.";

        // Show error toast
        toast.error(errorMessage, {
          icon: <i className="bi bi-exclamation-triangle-fill"></i>,
          className: "toast-error",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsLoading(false); // Stop loading
      }
    }


  };

  return (
    <div className="d-flex flex-xl-row flex-lg-row flex-md-column flex-column align-items-center vh-100 overflow-xl-hidden">
      <div className="login-banner position-relative h-100 d-flex justify-content-center flex-column">
        <h2>Accelerate Financial<br /> Decisions</h2>
        <p>Smarter insights with intelligent data processing.</p>
        <img className="z-1 d-none d-lg-block" src="/assets/images/login-bg.svg" alt="logo" />
        <div className="login-banner__bg-circle d-none d-lg-block">
          <div className="login-banner__bg-circle--first-ring"></div>
          <div className="login-banner__bg-circle--second-ring"></div>
        </div>
      </div>
      <div className="login-form">
        <div className="login-form__block">
          <img src="/assets/images/login-logo.svg" alt="site logo" />
          <h2>Sign In to your Account</h2>
          <div className="mb-4 position-relative">
            <label className="form-label">Email Address<span className="mandatory">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              className="form-control"
              onChange={handleChange}
            />
            {errors.email &&
              <div className="alert alert-danger" role="alert">
                {errors.email}
              </div>
            }
          </div>
          <div className="mb-2 position-relative">
            <label className="form-label">Password<span className="mandatory">*</span></label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                className="form-control"
                onChange={handleChange}
              />
              {errors.password &&
                <div className="alert alert-danger" role="alert">
                  {errors.password}
                </div>
              }
              <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} form-icon`} onClick={() => setShowPassword(!showPassword)}></i>
            </div>
          </div>
          <div className="">
            <a href="/forgot" className="link-text text-line active">Forgot Password?</a>
          </div>
          <div className="">
            <button type="button" className="btn btn-primary" onClick={handleSubmit}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          <div className="d-flex gap-2">
            <a className="link-text jacarta">Not yet registered?</a><a href="/signup" className="link-text text-line jacarta active">Create an account here</a>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
