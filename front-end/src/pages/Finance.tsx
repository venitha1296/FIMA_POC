import { useState, useEffect } from "react";
import "../styles/style.scss";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ApiFinder from "../apis/ApiFinder";

const Finance: React.FC = () => {
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
                <section>
                  <div className="main-upload">
                    <div className="breadcrumb">
                      <ul className="d-flex align-items-center gap-2">
                        <li><Link to="">Financial Data Agent</Link></li>
                        <li>
                          <img src="/assets/images/bread-right.svg" alt="right-arrow" />
                        </li>
                        <li><Link to="" className="active">Platinum Equity Holdings</Link></li>
                      </ul>
                    </div>
                  </div>


                 <div className="main-upload">
                    <div className="grid-view m-0 p-30 filter-input-form">
                        <div className="grid-data-view d-flex align-items-center justify-content-between mb-4 pb-2">
                            <div className="">
                              <div className="view-label">Company Name</div>
                              <div className="form-content">Platinum Equity Holdings</div>
                            </div>
                            <div className="">
                              <div className="view-label">Country</div>
                              <div className="form-content">South Korea</div>
                            </div>
                            <div className="">
                              <div className="view-label">Date</div>
                              <div className="form-content">10-Jan-2024</div>
                            </div>
                            <div className="">
                              <div className="view-label">Total Source Docs</div>
                              <button
                                className="btn btn-sm btn-download btn-download-violet gap-1" type="button">
                                <img src="/assets/images/file-icon.svg" alt="" />8
                              </button>
                            </div>
                            <div className="">
                              <div className="view-label">Source URL</div>
                              <a
                                className="view-source">
                                View Source
                              </a>
                            </div>
                            <div className="">
                              <div className="view-label">Status</div>
                              <span className="badge badge-completed">
                                Completed
                              </span>
                            </div>
                            <div className="">
                              <div className="view-label">Choose format to export output report</div>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-download btn-download-green"
                                  type="button"
                                  >
                                  <img src="/assets/images/file-download-green.svg" alt="" />XLS
                                </button>
                                <button
                                  className="btn btn-sm btn-download btn-download-blue"
                                  type="button"

                                >
                                  <img src="/assets/images/file-download-blue.svg" alt="" />JSON
                                </button>
                              </div>
                            </div>
                        </div>
                        <div className="table-heading">Source Documents</div>
                        <div className="table-responsive table-documents">
                          <table className="table mb-4">
                            <thead>
                              <tr className="border-th">
                                <th className="rounded-0">Document Name</th>
                                <th className="rounded-0" width="10%">View</th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr>
                                  <td className="border-start">Financial Report Q1 2023.pdf</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                                <tr>
                                  <td className="border-start">Annual Compliance Review.pdf</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                                <tr>
                                  <td className="border-start">Market Analysis Report.pdf</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                                <tr>
                                  <td className="border-start">Investment Strategy Document.pdf</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                                <tr>
                                  <td className="border-start">Product Roadmap.xlsx</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                                <tr>
                                  <td className="border-start">Legal Contract.pdf</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                                <tr>
                                  <td className="border-start">Project Proposal.docx</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                                <tr>
                                  <td className="border-start">Customer Survey Results.csv</td>
                                  <td className="border-end"><button className="btn btn-view" type="button">
                                    <i className="bi bi-eye"></i>
                                  </button></td>
                                </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="table-heading">Source URL’s</div>
                        <div className="table-responsive table-documents">
                          <table className="table mb-4">
                            <thead>
                              <tr className="border-th">
                                <th className="rounded-0">URL Link name</th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr>
                                  <td className="border-start border-end">
                                    <a
                                      className="view-source">
                                      https://www.exampleview/
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-start border-end">
                                    <a
                                      className="view-source">
                                      https://www.exampleview/
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-start border-end">
                                    <a
                                      className="view-source">
                                      https://www.exampleview/
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-start border-end">
                                    <a
                                      className="view-source">
                                      https://www.exampleview/
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-start border-end">
                                    <a
                                      className="view-source">
                                      https://www.exampleview/
                                    </a>
                                  </td>
                                </tr>
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>

                </section>

            </div>
        </div>
    );
};

export default Finance;
