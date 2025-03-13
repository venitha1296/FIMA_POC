import "../styles/style.scss";
import { useNavigate } from "react-router-dom";

const CorporateRegistry: React.FC = () => {
    const navigate = useNavigate(); // Hook for navigation

     // Logout function
     const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove token
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="d-flex">
           <h1>Corporate Registry</h1>
        </div>

    );
};

export default CorporateRegistry;
