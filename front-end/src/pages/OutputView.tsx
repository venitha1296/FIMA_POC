import { useState, useEffect } from "react";
import "../styles/style.scss";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ApiFinder from "../apis/ApiFinder";

const OutputView: React.FC = () => {
    const [profileName, setProfileName] = useState<string>("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); // Hook for navigation

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
                <Header profileName={profileName} handleLogout={handleLogout} />
               
            </div>
        </div>
    );
};

export default OutputView;
