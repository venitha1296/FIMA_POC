import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import "../styles/style.scss";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const [profileName, setProfileName] = useState<string>("");
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                setProfileName(decodedToken.username || "User");
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

     // Logout function
     const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove token
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="d-flex">
            <aside className="sidebar">
                <div className="sidebar--logo">
                    <img className="img-fluid" alt="logo" src="/assets/images/header-logo.svg" />
                </div>
                <ul>
                    <li><a href="" className="active"><img src="/assets/images/menu-home.svg" alt="home" />Home</a></li>
                    <li><a href=""><img src="/assets/images/menu-document-code.svg" alt="all" />All Data Agents</a></li>
                    <li><a href=""><img src="/assets/images/menu-building-4.svg" alt="corporate" />Corporate Registry Agent</a></li>
                    <li><a href=""><img src="/assets/images/menu-send.svg" alt="finance" />Financial Data Agent</a></li>
                    <li><a href=""><img src="/assets/images/home-global-search.svg" alt="web" />Web Research Media Agent</a></li>
                </ul>
            </aside>
            <div className="main-section">
                <header>
                    <div className="d-flex justify-content-end">
                        <div className="d-flex align-items-center">
                            <div className="profile-name">{profileName}</div>
                            <img className="profile-image img-fluid" src="/assets/images/profile-pic.jpg" alt="" />
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </header>
                <section>
                    <div className="home-welcome-links">
                        <h2 className="jacarta">Accelerate financial decisions with</h2>
                        <h2 className="cobalt">smart data processing.</h2>
                        <p>Select an agent that aligns with your specific data needs and streamline your financial operations with our AI-powered solutions.</p>
                        <div className="container px-5 pt-5">
                            <div className="row px-5">
                                <div className="col-md-4">
                                    <div className="link-box">
                                        <img src="/assets/images/link-box1.svg" alt="" />
                                        <h3>Corporate Registry Agent</h3>
                                        <h4>Quickly access business information, connect to official registries, and retrieve complete profiles with full verification.</h4>
                                        <a href="">Select Agent<svg className="ms-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.4244 13.9498C10.2069 13.7323 10.2069 13.3723 10.4244 13.1548L14.5794 8.99984L10.4244 4.84484C10.2069 4.62734 10.2069 4.26734 10.4244 4.04984C10.6419 3.83234 11.0019 3.83234 11.2194 4.04984L15.7719 8.60234C15.9894 8.81984 15.9894 9.17984 15.7719 9.39734L11.2194 13.9498C11.1069 14.0623 10.9644 14.1148 10.8219 14.1148C10.6794 14.1148 10.5369 14.0623 10.4244 13.9498Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                            <path d="M2.625 9.5625C2.3175 9.5625 2.0625 9.3075 2.0625 9C2.0625 8.6925 2.3175 8.4375 2.625 8.4375H15.2475C15.555 8.4375 15.81 8.6925 15.81 9C15.81 9.3075 15.555 9.5625 15.2475 9.5625H2.625Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                        </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="link-box">
                                        <img src="assets/images/link-box2.svg" alt="" />
                                        <h3>Financial Data Agent</h3>
                                        <h4>Streamline financial data processing from audited and bank statemnts for faster credit assessment and analysis.</h4>
                                        <a href="">Select Agent<svg className="ms-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.4244 13.9498C10.2069 13.7323 10.2069 13.3723 10.4244 13.1548L14.5794 8.99984L10.4244 4.84484C10.2069 4.62734 10.2069 4.26734 10.4244 4.04984C10.6419 3.83234 11.0019 3.83234 11.2194 4.04984L15.7719 8.60234C15.9894 8.81984 15.9894 9.17984 15.7719 9.39734L11.2194 13.9498C11.1069 14.0623 10.9644 14.1148 10.8219 14.1148C10.6794 14.1148 10.5369 14.0623 10.4244 13.9498Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                            <path d="M2.625 9.5625C2.3175 9.5625 2.0625 9.3075 2.0625 9C2.0625 8.6925 2.3175 8.4375 2.625 8.4375H15.2475C15.555 8.4375 15.81 8.6925 15.81 9C15.81 9.3075 15.555 9.5625 15.2475 9.5625H2.625Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                        </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="link-box">
                                        <img src="assets/images/link-box3.svg" alt="" />
                                        <h3>Web Research Media Agent</h3>
                                        <h4>Intelligently extract and transform web data for real-time media analysis, delivering actionable insights for decision making.</h4>
                                        <a href="">Select Agent<svg className="ms-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.4244 13.9498C10.2069 13.7323 10.2069 13.3723 10.4244 13.1548L14.5794 8.99984L10.4244 4.84484C10.2069 4.62734 10.2069 4.26734 10.4244 4.04984C10.6419 3.83234 11.0019 3.83234 11.2194 4.04984L15.7719 8.60234C15.9894 8.81984 15.9894 9.17984 15.7719 9.39734L11.2194 13.9498C11.1069 14.0623 10.9644 14.1148 10.8219 14.1148C10.6794 14.1148 10.5369 14.0623 10.4244 13.9498Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                            <path d="M2.625 9.5625C2.3175 9.5625 2.0625 9.3075 2.0625 9C2.0625 8.6925 2.3175 8.4375 2.625 8.4375H15.2475C15.555 8.4375 15.81 8.6925 15.81 9C15.81 9.3075 15.555 9.5625 15.2475 9.5625H2.625Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                        </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default Dashboard;
