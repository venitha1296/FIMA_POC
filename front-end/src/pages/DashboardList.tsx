import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef } from "react";
import "../styles/style.scss";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ApiFinder from "../apis/ApiFinder";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file
import { SOURCE_URL } from "../constants";
import Loader from "../Components/Loader";
import CountryDropdown from "../Components/CountryDropdown";
import { exportExcel, exportJSON } from "../utils/exportUtils";

interface CountryOption {
  value: string;
  label: string;
  code: string;
}

const DashboardList: React.FC = () => {

  const [profileName, setProfileName] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]); // Store API response data
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [activeTab, setActiveTab] = useState<string>("Corporate Registry Agent");

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
    fetchCountries();
    fetchData();
  }, []);

  // Fetch API data
  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      const response = await ApiFinder.get(`/agents/countries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const countries = response.data.map(({ name, code }: { name: string; code: string }) => ({
        value: name,
        label: name,
        code: name
      }));
      setCountries(countries);
      console.log(countries);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        let errorMessage = 'Token expired or invalid. Logging out...';
        toast.error(errorMessage, {
          icon: <i className="bi bi-exclamation-triangle-fill"></i>,
          className: "toast-error",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.removeItem("authToken");
        navigate('/login');
      } else {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Error fetching data", {
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
        setIsLoading(false);
      }, 1000);
    }
  };

  // Fetch API data with search
  const fetchData = async (page: number = 1, perPage: number = itemsPerPage, country?: string, search?: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      let url = `/agents?page=${page}&limit=${perPage}&type=${encodeURIComponent(activeTab)}`;
      if (country) {
        url += `&country=${country}`;
      }
      if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await ApiFinder.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { agents, currentPage, totalPages, totalRecords } = response.data.data;
      setAgents(agents);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
      setTotalRecords(totalRecords);

    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        let errorMessage = 'Token expired or invalid. Logging out...';
        toast.error(errorMessage, {
          icon: <i className="bi bi-exclamation-triangle-fill"></i>,
          className: "toast-error",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.removeItem("authToken");
        navigate('/login');
      } else {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Error fetching data", {
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
        setIsLoading(false);
      }, 1000);
    }
  };

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await ApiFinder.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      navigate('/login');
    }
  };

  const handleDownload = (data: any, filename: string) => {
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle search input change with debounce
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(() => {
      fetchData(1, itemsPerPage, selectedCountry?.value, value);
    }, 500); // Wait 500ms after user stops typing
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    fetchData(pageNumber, itemsPerPage, selectedCountry?.value, searchQuery);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(event.target.value);
    setItemsPerPage(newItemsPerPage);
    fetchData(1, newItemsPerPage, selectedCountry?.value, searchQuery);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handleCountryChange = (option: CountryOption | null) => {
    setSelectedCountry(option);
    fetchData(1, itemsPerPage, option?.value, searchQuery);
  };

  // Helper function to highlight matching text
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tabTypes: { [key: string]: string } = {
      'cr-agent': 'Corporate Registry Agent',
      'fd-agent': 'Financial Data Agent',
      'wrm-agent': 'Web Research Media Agent'
    };

    const newTabValue = tabTypes[tabId];
    setActiveTab(newTabValue);
    console.log("selectedCountry", selectedCountry)

    // Update tab classes
    document.querySelectorAll('.nav-link').forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(tabId)?.classList.add('active');

    // Pass the new tab value directly instead of using activeTab state
    let url = `/agents?page=1&limit=${itemsPerPage}&type=${encodeURIComponent(newTabValue)}`;
    if (selectedCountry?.value) {
      url += `&country=${selectedCountry.value}`;
    }
    if (searchQuery && searchQuery.trim() !== '') {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    // Call API directly with the constructed URL
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoading(true);
      ApiFinder.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const { agents, currentPage, totalPages, totalRecords } = response.data.data;
          setAgents(agents);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);
          setTotalRecords(totalRecords);
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            let errorMessage = 'Token expired or invalid. Logging out...';
            toast.error(errorMessage, {
              icon: <i className="bi bi-exclamation-triangle-fill"></i>,
              className: "toast-error",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            localStorage.removeItem("authToken");
            navigate('/login');
          } else {
            console.error("Error fetching data:", error);
            toast.error(error.message || "Error fetching data", {
              icon: <i className="bi bi-exclamation-triangle-fill"></i>,
              className: "toast-error",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        });
    }
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
                  <a
                    className="nav-link active"
                    id="cr-agent"
                    data-bs-toggle="tab"
                    href="#cr-agent-panel"
                    role="tab"
                    aria-controls="cr-agent-panel"
                    aria-selected="true"
                    onClick={() => handleTabChange('cr-agent')}
                  >
                    Corporate Registry Agent
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="fd-agent"
                    data-bs-toggle="tab"
                    href="#fd-agent-panel"
                    role="tab"
                    aria-controls="fd-agent-panel"
                    aria-selected="false"
                    onClick={() => handleTabChange('fd-agent')}
                  >
                    Financial Data Agent
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="wrm-agent"
                    data-bs-toggle="tab"
                    href="#wrm-agent-panel"
                    role="tab"
                    aria-controls="wrm-agent-panel"
                    aria-selected="false"
                    onClick={() => handleTabChange('wrm-agent')}
                  >
                    Web Research Media Agent
                  </a>
                </li>
              </ul>
            </div>

            <div className="tab-content" id="tab-content">
              <div className="tab-pane active" id="cr-agent-panel" role="tabpanel" aria-labelledby="cr-agent">
                <div className="filter-view">
                  <h3>Overview</h3>
                  <div className="d-flex align-items-center gap-3">
                    <CountryDropdown countries={countries} onSelectCountry={handleCountryChange} />
                    <div className="input-group">
                      <span className="input-group-text bi bi-search bg-transparent"></span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                {isLoading ? (
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
                                <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                <td>{highlightText(agent.company, searchQuery)}</td>
                                <td>{highlightText(agent.country, searchQuery)}</td>
                                <td>
                                  <span className={`badge badge-${agent.status.toLowerCase()}`}>
                                    {agent.status}
                                  </span>
                                </td>
                                <td>{agent.request_time}</td>
                                <td>
                                  <a
                                    href={agent.source_url || "#"}
                                    className={`text-line ${!agent.source_url ? "disabled-link" : ""}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => !agent.source_url && e.preventDefault()} // Prevents click if URL is missing
                                  >
                                    View Source
                                  </a>
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className={`btn btn-sm btn-download ${agent.file_output && Object.keys(agent.file_output).length > 0
                                          ? "btn-download-green"
                                          : "opacity-50 cursor-not-allowed"
                                        }`}
                                      type="button"
                                      disabled={!agent.file_output || Object.keys(agent.file_output).length === 0} // Disable if file_output is empty
                                      onClick={() => {
                                        if (agent.file_output?.data) {
                                          const timestamp = new Date().toISOString().replace(/[:.-]/g, "_"); // Formats time safely
                                          const fileName = `${agent.type}_${agent.company}_${timestamp}`;
                                          
                                          exportExcel(agent.file_output.data, fileName);
                                        }
                                      }}
                                    > 
                                      <img src="/assets/images/file-download-green.svg" alt="" />XLS
                                    </button>
                                    <button
                                      className={`btn btn-sm btn-download ${agent.file_output && Object.keys(agent.file_output).length > 0
                                          ? "btn-download-green"
                                          : "opacity-50 cursor-not-allowed"
                                        }`}
                                      type="button"
                                      disabled={!agent.file_output || Object.keys(agent.file_output).length === 0} // Disable if file_output is empty
                                      onClick={() => {
                                        if (agent.file_output?.data) {
                                          const timestamp = new Date().toISOString().replace(/[:.-]/g, "_"); // Formats time safely
                                          const fileName = `${agent.type}_${agent.company}_${timestamp}`;
                                          
                                          exportJSON(agent.file_output.data, fileName);
                                        }
                                      }}
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
                          <select
                            className="form-control"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="arrow"></span>
                        </div>
                        <label>of {totalRecords}</label>
                      </div>
                      <nav>
                        <ul className="pagination justify-content-end">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a
                              className="page-link"
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </a>
                          </li>
                          {getPageNumbers().map(number => (
                            <li
                              key={number}
                              className={`page-item ${currentPage === number ? 'active' : ''}`}
                            >
                              <a
                                className="page-link"
                                onClick={() => handlePageChange(number)}
                                style={{ cursor: 'pointer' }}
                              >
                                {number}
                              </a>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a
                              className="page-link"
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </>
                )}

              </div>
              {/* Financial Data Agent */}
              <div className="tab-pane" id="fd-agent-panel" role="tabpanel" aria-labelledby="fd-agent">
                <div className="filter-view">
                  <h3>Overview</h3>
                  <div className="d-flex align-items-center gap-3">
                    <CountryDropdown countries={countries} onSelectCountry={handleCountryChange} />
                    <div className="input-group">
                      <span className="input-group-text bi bi-search bg-transparent"></span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                {isLoading ? (
                  <Loader /> // Show loader when loading
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>S No</th>
                            <th>Company Name</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Source Docs</th>
                            <th>File output</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agents.length > 0 ? (
                            agents.map((agent, index) => (
                              <tr key={agent.id}>
                                <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                <td>{highlightText(agent.company, searchQuery)}</td>
                                <td>
                                  <span className={`badge badge-${agent.status.toLowerCase()}`}>
                                    {agent.status}
                                  </span>
                                </td>
                                <td>{agent.request_time}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-download btn-download-green"
                                    type="button"
                                    disabled={!agent.output} // Disable if output is null
                                    onClick={() => agent.output && handleDownload(agent.output, 'docx')} // Call download function if output exists
                                  >
                                    <img src="/assets/images/file-download-green.svg" alt="" />Doc
                                  </button>
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
                          <select
                            className="form-control"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="arrow"></span>
                        </div>
                        <label>of {totalRecords}</label>
                      </div>
                      <nav>
                        <ul className="pagination justify-content-end">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a
                              className="page-link"
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </a>
                          </li>
                          {getPageNumbers().map(number => (
                            <li
                              key={number}
                              className={`page-item ${currentPage === number ? 'active' : ''}`}
                            >
                              <a
                                className="page-link"
                                onClick={() => handlePageChange(number)}
                                style={{ cursor: 'pointer' }}
                              >
                                {number}
                              </a>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a
                              className="page-link"
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </>

                )}
              </div>
              {/* Web Media Search Agent */}
              <div className="tab-pane" id="wrm-agent-panel" role="tabpanel" aria-labelledby="wrm-agent">
                <div className="filter-view">
                  <h3>Overview</h3>
                  <div className="d-flex align-items-center gap-3">
                    <CountryDropdown countries={countries} onSelectCountry={handleCountryChange} />
                    <div className="input-group">
                      <span className="input-group-text bi bi-search bg-transparent"></span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                {isLoading ? (
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
                            <th>File output</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agents.length > 0 ? (
                            agents.map((agent, index) => (
                              <tr key={agent.id}>
                                <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                <td>{highlightText(agent.company, searchQuery)}</td>
                                <td>{highlightText(agent.country, searchQuery)}</td>
                                <td>
                                  <span className={`badge badge-${agent.status.toLowerCase()}`}>
                                    {agent.status}
                                  </span>
                                </td>
                                <td>{agent.request_time}</td>
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
                          <select
                            className="form-control"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="arrow"></span>
                        </div>
                        <label>of {totalRecords}</label>
                      </div>
                      <nav>
                        <ul className="pagination justify-content-end">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a
                              className="page-link"
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </a>
                          </li>
                          {getPageNumbers().map(number => (
                            <li
                              key={number}
                              className={`page-item ${currentPage === number ? 'active' : ''}`}
                            >
                              <a
                                className="page-link"
                                onClick={() => handlePageChange(number)}
                                style={{ cursor: 'pointer' }}
                              >
                                {number}
                              </a>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a
                              className="page-link"
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </>

                )}

              </div>
            </div>
          </div>


        </section>

      </div>
      <ToastContainer />
    </div>

  );
};

export default DashboardList;
