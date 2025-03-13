import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import "../styles/style.scss";
import { useNavigate } from "react-router-dom";

const DashboardList: React.FC = () => {
    const [profileName, setProfileName] = useState<string>("");
    const navigate = useNavigate(); // Hook for navigation

    // useEffect(() => {
    //     const token = localStorage.getItem("authToken");
    //     if (token) {
    //         try {
    //             const decodedToken: any = jwtDecode(token);
    //             setProfileName(decodedToken.username || "User");
    //         } catch (error) {
    //             console.error("Invalid token", error);
    //         }
    //     }
    // }, []);

     // Logout function
     const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove token
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="d-flex">
           <h1>Dashboard List</h1>
        </div>

    );
};

export default DashboardList;
