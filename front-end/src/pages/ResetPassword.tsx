import "../styles/style.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'; // Importing useNavigate from react-router-dom
import axios from 'axios'; // Import axios for API requests
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file
import "bootstrap-icons/font/bootstrap-icons.css";


const ResetPassword = () => {
    const { resetToken } = useParams(); // Get token from URL
    console.log("resetToken", resetToken)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate(); // Hook for navigation
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        confirmPassword: "",
        password: "",
    });

    // Redirect to login if token is missing
    useEffect(() => {
        // if (!resetToken) {
        //     toast.error('Invalid reset link.', { position: "top-right", autoClose: 5000 });
        //     navigate("/login");
        // }
    }, [resetToken, navigate]);

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
            confirmPassword: "",
            password: "",
        };

        // Password validation
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!passwordPattern.test(formData.password)) {
            newErrors.password = "Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character.";
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        // Return true if no errors
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If there are errors, do not proceed with the API call
        if (validateForm()) {
            try {
                const response = await axios.post("http://localhost:3001/api/resetPassword", {
                    password: formData.password,
                    resetToken, // Send token to backend
                });
                console.log(response.data);
                if (response.status === 200) {
                    // On successful signup, you can redirect to login or show a success message
                    // Show success toast
                    toast.success('Reset successful!', {
                        position: "top-right",
                        autoClose: 2000, // Automatically closes after 5 seconds
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    setTimeout(() => {
                        navigate("/login"); // Redirect after success
                    }, 2000);
                }
            } catch (error:any) {
                const errorMessage = error.response?.data?.message || "Reset password failed! Please try again.";
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
                    <h2>Reset Password</h2>
                    <div className="mb-4 position-relative">
                        <label className="form-label">Password<span className="mandatory">*</span></label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter Passowrd"
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
                    <div className="mb-2 position-relative">
                        <label className="form-label">Confirm Password<span className="mandatory">*</span></label>
                        <div className="position-relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                className="form-control"
                                onChange={handleChange}
                            />
                            {errors.confirmPassword &&
                                <div className="alert alert-danger" role="alert">
                                    {errors.confirmPassword}
                                </div>
                            }
                            <i className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"} form-icon`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                        </div>
                    </div>
                    <div className="">
                        <a href="" className="link-text text-line active">Forgot Password?</a>
                    </div>
                    <div className="">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Reset Password</button>
                    </div>
                    {/* <div className="d-flex gap-2">
                        <a href="" className="link-text text-line jacarta">Not yet registered?</a><a href="" className="link-text text-line jacarta active">Create an account here</a>
                    </div> */}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ResetPassword;
