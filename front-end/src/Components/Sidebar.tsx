import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
    isMinimized: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, toggleSidebar }) => {
    const location = useLocation(); // Get current path
    return (
        <aside className={`sidebar ${isMinimized ? "minimized" : ""}`}>
            <div className="sidebar--logo">
                <img className="img-fluid" alt="logo" src="/assets/images/header-logo.svg" />
            </div>
            <i className="bi bi-code" onClick={toggleSidebar}></i>
            <ul>
                <li>
                    <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                        <img src="/assets/images/menu-home.svg" alt="home" />{!isMinimized && "Home"}
                    </Link>
                </li>
                <li>
                    <Link to="/agents" className={location.pathname === "/agents" ? "active" : ""}>
                        <img src="/assets/images/menu-document-code.svg" alt="all" /> {!isMinimized && "All Data Agents"}
                    </Link>
                </li>
                <li>
                    <Link to="" className={location.pathname === "/corporate" ? "active" : ""}>
                        <img src="/assets/images/menu-building-4.svg" alt="corporate" />{!isMinimized && "Corporate Registry Agent"}
                    </Link>
                </li>
                <li>
                    <Link to="" className={location.pathname === "/finance" ? "active" : ""}>
                        <img src="/assets/images/menu-send.svg" alt="finance" />{!isMinimized && "Financial Data Agent"}
                    </Link>
                </li>
                <li>
                    <Link to="" className={location.pathname === "/web" ? "active" : ""}>
                        <img src="/assets/images/home-global-search.svg" alt="web" />{!isMinimized && "Web Research Media Agent"}
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
