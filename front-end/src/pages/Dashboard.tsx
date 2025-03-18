import { useState, useEffect } from "react";
import "../styles/style.scss";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ApiFinder from "../apis/ApiFinder";

const Dashboard: React.FC = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    };

    const handleLogout = async () => {
        try {
            await ApiFinder.post('/auth/logout');
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
            navigate('/login');
        }
    };

    return (
        <div className="d-flex">
            <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
            <div className="main-section">
                <Header handleLogout={handleLogout} />
                <section>
                    <div className="home-welcome-links">
                        <h2 className="jacarta">Accelerate financial decisions with</h2>
                        <h2 className="cobalt mb-3">smart data processing.</h2>
                        <p>Select an agent that aligns with your specific data needs and streamline your financial operations with our AI-powered solutions.</p>
                        <div className="container px-xl-5 pt-5">
                            <div className="row px-xl-5">
                                <div className="col-lg-4 pb-3">
                                    <div className="link-box gradient-bg violet">
                                        <img className="z-1 position-relative" src="/assets/images/link-box1.svg" alt="" />
                                        <h3 className="z-1 position-relative">Corporate Registry Agent</h3>
                                        <h4 className="z-1 position-relative">Quickly access business information, connect to official registries, and retrieve complete profiles with full verification.</h4>
                                        <Link to="/corporate-registry" className="text-decoration-none">Select Agent<svg className="ms-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.4244 13.9498C10.2069 13.7323 10.2069 13.3723 10.4244 13.1548L14.5794 8.99984L10.4244 4.84484C10.2069 4.62734 10.2069 4.26734 10.4244 4.04984C10.6419 3.83234 11.0019 3.83234 11.2194 4.04984L15.7719 8.60234C15.9894 8.81984 15.9894 9.17984 15.7719 9.39734L11.2194 13.9498C11.1069 14.0623 10.9644 14.1148 10.8219 14.1148C10.6794 14.1148 10.5369 14.0623 10.4244 13.9498Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                            <path d="M2.625 9.5625C2.3175 9.5625 2.0625 9.3075 2.0625 9C2.0625 8.6925 2.3175 8.4375 2.625 8.4375H15.2475C15.555 8.4375 15.81 8.6925 15.81 9C15.81 9.3075 15.555 9.5625 15.2475 9.5625H2.625Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                        </svg>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-lg-4 pb-3">
                                    <div className="link-box gradient-bg orange">
                                        <img className="z-1 position-relative" src="assets/images/link-box2.svg" alt="" />
                                        <h3 className="z-1 position-relative">Financial Data Agent</h3>
                                        <h4 className="z-1 position-relative">Streamline financial data processing from audited and bank statemnts for faster credit assessment and analysis.</h4>
                                        <Link to="/financial-data" className="text-decoration-none">Select Agent<svg className="ms-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.4244 13.9498C10.2069 13.7323 10.2069 13.3723 10.4244 13.1548L14.5794 8.99984L10.4244 4.84484C10.2069 4.62734 10.2069 4.26734 10.4244 4.04984C10.6419 3.83234 11.0019 3.83234 11.2194 4.04984L15.7719 8.60234C15.9894 8.81984 15.9894 9.17984 15.7719 9.39734L11.2194 13.9498C11.1069 14.0623 10.9644 14.1148 10.8219 14.1148C10.6794 14.1148 10.5369 14.0623 10.4244 13.9498Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                            <path d="M2.625 9.5625C2.3175 9.5625 2.0625 9.3075 2.0625 9C2.0625 8.6925 2.3175 8.4375 2.625 8.4375H15.2475C15.555 8.4375 15.81 8.6925 15.81 9C15.81 9.3075 15.555 9.5625 15.2475 9.5625H2.625Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                        </svg>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-lg-4 pb-3">
                                    <div className="link-box gradient-bg yellow">
                                        <img className="z-1 position-relative" src="assets/images/link-box3.svg" alt="" />
                                        <h3 className="z-1 position-relative">Web Research Media Agent</h3>
                                        <h4 className="z-1 position-relative">Intelligently extract and transform web data for real-time media analysis, delivering actionable insights for decision making.</h4>
                                        <Link to="/web-research" className="text-decoration-none">Select Agent<svg className="ms-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.4244 13.9498C10.2069 13.7323 10.2069 13.3723 10.4244 13.1548L14.5794 8.99984L10.4244 4.84484C10.2069 4.62734 10.2069 4.26734 10.4244 4.04984C10.6419 3.83234 11.0019 3.83234 11.2194 4.04984L15.7719 8.60234C15.9894 8.81984 15.9894 9.17984 15.7719 9.39734L11.2194 13.9498C11.1069 14.0623 10.9644 14.1148 10.8219 14.1148C10.6794 14.1148 10.5369 14.0623 10.4244 13.9498Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                            <path d="M2.625 9.5625C2.3175 9.5625 2.0625 9.3075 2.0625 9C2.0625 8.6925 2.3175 8.4375 2.625 8.4375H15.2475C15.555 8.4375 15.81 8.6925 15.81 9C15.81 9.3075 15.555 9.5625 15.2475 9.5625H2.625Z" fill="#0051B0" stroke="#0051B0" stroke-width="0.5" />
                                        </svg>
                                        </Link>
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
