
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import "../styles/style.scss";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ApiFinder from "../apis/ApiFinder";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file
import { SOURCE_URL } from "../constants";
import Loader from "../Components/Loader";

const DashboardList: React.FC = () => {

  const [profileName, setProfileName] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // Loader state
  const [agents, setAgents] = useState<any[]>([]); // Store API response data

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

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch API data
  const fetchData = async () => {
    try {
      setLoading(true); // Start loader
      const token = localStorage.getItem("authToken"); // Retrieve token from storage

      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      const response = await ApiFinder.get("/agents", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      let agents = response.data.data.agents;
      console.log("data", response.data.data.agents); // Log the fetched data for debugging
      setAgents(agents); // Update state with API response
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        let errorMessage = 'Token expired or invalid. Logging out...';
        // Show error toast
        toast.error(errorMessage, {
          icon: <i className="bi bi-exclamation-triangle-fill"></i>,
          className: "toast-error",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.removeItem("token"); // Remove expired token
        navigate('/login');
      } else {
        console.error("Error fetching data:", error);
        // Show error toast
        toast.error(error, {
          icon: <i className="bi bi-exclamation-triangle-fill"></i>,
          className: "toast-error",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setTimeout(() => {
        setLoading(false); // Stop loader
      }, 1000);
      
    }
  };

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/login"); // Redirect to login page
  };

  const handleDownload = (data: any, format: string) => {
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `agent_output.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="d-flex">
      <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
      <div className="main-section">
        <Header profileName={profileName} handleLogout={handleLogout} />

        <section>

          <div className="grid-view">
            <div className="d-inline-flex align-items-center tab-header">
              <h2 className="page-heading">All Data Agents</h2>
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <a className="nav-link active" id="cr-agent" data-bs-toggle="tab" href="#cr-agent-panel" role="tab" aria-controls="cr-agent-panel" aria-selected="true">Corporate Registry Agent</a>
                </li>
                <li className="nav-item" role="presentation">
                  <a className="nav-link" id="fd-agent" data-bs-toggle="tab" href="#fd-agent-panel" role="tab" aria-controls="fd-agent-panel" aria-selected="false">Financial Data Agent</a>
                </li>
                <li className="nav-item" role="presentation">
                  <a className="nav-link" id="wrm-agent" data-bs-toggle="tab" href="#wrm-agent-panel" role="tab" aria-controls="wrm-agent-panel" aria-selected="false">Web Research Media Agent</a>
                </li>
              </ul>
            </div>

            <div className="tab-content" id="tab-content">
              <div className="tab-pane active" id="cr-agent-panel" role="tabpanel" aria-labelledby="cr-agent">
                <div className="filter-view">
                  <h3>OverView</h3>
                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-outline-primary"><i className="bi bi-filter"></i>Filter by Country</button>
                    <div className="input-group">
                      <span className="input-group-text bi bi-search bg-transparent"></span>
                      <input type="text" className="form-control border-start-0" placeholder="Search" />
                    </div>
                  </div>
                </div>
                {loading ? (
                  <Loader /> // Show loader when loading
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>S No</th>
                            <th>Company Name</th>
                            <th>Country</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Source URL</th>
                            <th>File output</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agents.length > 0 ? (
                            agents.map((agent, index) => (
                              <tr key={agent.id}>
                                <td>{index + 1}</td>
                                <td>{agent.company}</td>
                                <td>{agent.country}</td>
                                <td>
                                  <span className={`badge badge-${agent.status.toLowerCase()}`}>
                                    {agent.status}
                                  </span>
                                </td>
                                <td>{agent.request_time}</td>
                                <td>
                                  <a href={agent.source_url || SOURCE_URL} className="text-line" target="_blank" rel="noopener noreferrer">
                                    View Source
                                  </a>
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-download btn-download-green"
                                      type="button"
                                      disabled={!agent.output} // Disable if output is null
                                      onClick={() => agent.output && handleDownload(agent.output, 'xls')} // Call download function if output exists
                                    >
                                      <img src="/assets/images/file-download-green.svg" alt="" />XLS
                                    </button>
                                    <button
                                      className="btn btn-sm btn-download btn-download-green"
                                      type="button"
                                      disabled={!agent.output} // Disable if output is null
                                      onClick={() => agent.output && handleDownload(agent.output, 'json')} // Call download function if output exists
                                    >
                                      <img src="/assets/images/file-download-blue.svg" alt="" />JSON
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-between bg-white px-3 mb-4">
                      <div className="pagination-count d-flex align-items-center">
                        <label>Showing</label>
                        <div className="select-box">
                          <select className="form-control">
                            <option>10</option>
                            <option>12</option>
                            <option>15</option>
                            <option>20</option>
                          </select>
                          <span className="arrow"></span>
                        </div>
                        <label>of 50</label>
                      </div>
                      <nav>
                        <ul className="pagination justify-content-end">
                          <li className="page-item disabled">
                            <a className="page-link"><i className="bi bi-chevron-left"></i></a>
                          </li>
                          <li className="page-item active"><a className="page-link" href="#">1</a></li>
                          <li className="page-item"><a className="page-link" href="#">2</a></li>
                          <li className="page-item"><a className="page-link" href="#">3</a></li>
                          <li className="page-item"><a className="page-link" href="#">4</a></li>
                          <li className="page-item"><a className="page-link" href="#">5</a></li>
                          <li className="page-item">
                            <a className="page-link" href="#"><i className="bi bi-chevron-right"></i></a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </>

                )}


              </div>
              <div className="tab-pane" id="fd-agent-panel" role="tabpanel" aria-labelledby="fd-agent">Financial Data Agent</div>
              <div className="tab-pane" id="wrm-agent-panel" role="tabpanel" aria-labelledby="wrm-agent">Web Research Media Agent</div>
            </div>
          </div>


        </section>

      </div>
      <ToastContainer />
    </div>

  );
};

export default DashboardList;
