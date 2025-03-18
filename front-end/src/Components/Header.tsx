import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';


interface HeaderProps {
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleLogout }) => {
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
        try {
            // Decode the JWT token (it's base64 encoded)
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', payload);
            setProfileName(payload.username || "User");
        } catch (error) {
            console.error("Error decoding token:", error);
            setProfileName("User");
        }
    } else {
        console.log('No authToken found in cookies');
    }
}, []);

  return (
    <header>
      <div className="d-flex justify-content-end">
        <div className="d-flex align-items-center">
          <div className="profile-name">{profileName}</div>
          <div className="dropdown">
            <img
              className="profile-image img-fluid cursor"
              data-bs-toggle="dropdown"
              src="/assets/images/profile-pic.jpg"
              alt=""
            />
            <ul className="dropdown-menu py-1 border-0 shadow-sm">
              <li>
                <Link className="dropdown-item border-bottom fs-14 cursor jacarta" to="/profile">
                  My Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item border-bottom fs-14 cursor jacarta" to="/change-password">
                  Change Password
                </Link>
              </li>
              <li>
                <button className="dropdown-item text-danger fs-14 cursor border-0 bg-transparent" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
