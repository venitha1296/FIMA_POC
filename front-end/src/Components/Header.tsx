import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  profileName: string;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ profileName, handleLogout }) => {
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
