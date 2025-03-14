import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isMinimized: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isMinimized ? "minimized" : ""}`}>
      <div className="sidebar--logo">
        <img className="img-fluid" alt="logo" src="/assets/images/header-logo.svg" />
      </div>
      <i className="bi bi-code" onClick={toggleSidebar}></i>
      <ul>
        <li>
          <Link to="/dashboard" className="active">
            <img src="/assets/images/menu-home.svg" alt="home" />{!isMinimized && "Home"}
          </Link>
        </li>
        <li>
          <Link to="/agents">
            <img src="/assets/images/menu-document-code.svg" alt="all" /> {!isMinimized && "All Data Agents"}
          </Link>
        </li>
        <li>
          <Link to="">
            <img src="/assets/images/menu-building-4.svg" alt="corporate" />{!isMinimized && "Corporate Registry Agent"}
          </Link>
        </li>
        <li>
          <Link to="">
            <img src="/assets/images/menu-send.svg" alt="finance" />{!isMinimized && "Financial Data Agent"}
          </Link>
        </li>
        <li>
          <Link to="">
            <img src="/assets/images/home-global-search.svg" alt="web" />{!isMinimized && "Web Research Media Agent"}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
