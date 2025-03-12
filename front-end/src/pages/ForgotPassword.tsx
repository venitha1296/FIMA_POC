import "../styles/style.scss";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom
import axios from 'axios'; // Import axios for API requests
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file
import "bootstrap-icons/font/bootstrap-icons.css";


const ForgotPassword = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [isLoading, setIsLoading] = useState(false); // New state for loader
    const [formData, setFormData] = useState({
        email: "",
    });

    const [errors, setErrors] = useState({
        email: "",
    });

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
        };

        // Email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
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
                const response = await axios.post("http://localhost:3001/api/sendLink", formData); // Your backend API endpoint for login
                console.log(response.data.status);
                if (response.data && response.data.status == 200) {
                    // On successful signup, you can redirect to login or show a success message
                    // Show success toast
                    toast.success('Mail sent successfully!', {
                        position: "top-right",
                        autoClose: 2000, // Automatically closes after 5 seconds
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    setTimeout(() => {
                        navigate("/sendLink"); // Redirect after success
                    }, 2000);
                }
            } catch (error: any) {
                // Use optional chaining to safely access the error message
                const errorMessage = error.response?.data?.error || "An Error Occured! Please try again.";

                // Handle any API errors here, for example showing a general error message
                // Show error toast
                toast.error(errorMessage, {
                    position: "top-right",
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
                    <h2>Forgot Password</h2>
                    <div className="mb-4 position-relative">
                        <label className="form-label">Enter Your Email<span className="mandatory">*</span></label>
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
                    <div className="">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
                            Send Link
                        </button>
                    </div>
                    <div className="d-flex gap-2">
                        <a href="/login" className="link-text text-line jacarta active">Back to Login?</a>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ForgotPassword;
