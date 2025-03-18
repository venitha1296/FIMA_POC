import { useState, useEffect } from "react";
import "../styles/style.scss";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ApiFinder from "../apis/ApiFinder";

const WebResearch: React.FC = () => {
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
                   <li><a href="">Home</a></li>
                   <li>
                    <img src="/assets/images/bread-right.svg" alt="right-arrow" />
                   </li>
                   <li><a href="" className="active">Web Research Media Agent</a></li>
                  </ul>
                 </div>

                 <div className="filter-input-form">
                  <h2>Search for company by specifying the name and the country</h2>
                  <p>Get real time business insights from diverse media sources</p>
                  <div className="row mb-3">
                     <div className="col-md-3">
                       <div className="">
                         <label className="form-label">Company Name</label>
                         <input type="email" className="form-control" placeholder="Enter Company Name" />
                       </div>
                     </div>
                     <div className="col-md-3">
                       <div className="">
                          <label className="form-label">Country</label>
                          <select className="form-select">
                            <option selected>Select Country</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                       </div>
                     </div>
                     <div className="col-md-3">
                       <div className="">
                          <label className="form-label">From Date</label>
                          <select disabled className="form-select opacity-50">
                            <option selected>Select Country</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                       </div>
                     </div>
                     <div className="col-md-3">
                       <div className="">
                          <label className="form-label">To Date</label>
                          <select disabled className="form-select opacity-50">
                            <option selected>Select Country</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                       </div>
                     </div>
                  </div>
                  <div className="row mb-3">
                     <div className="col-md-12">
                      <div className="mb-2"><label className="form-label">Research Focus</label></div>
                      <div className="form-check form-check-inline me-5">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                        <label className="form-check-label" for="inlineRadio1">News & Media</label>
                      </div>
                      <div className="form-check form-check-inline me-5">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                        <label className="form-check-label" for="inlineRadio2">Market Reports</label>
                      </div>
                      <div className="form-check form-check-inline me-5">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" />
                        <label className="form-check-label" for="inlineRadio3">Social Sentiment</label>
                      </div>
                      <div className="form-check form-check-inline me-5">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option4" />
                        <label className="form-check-label" for="inlineRadio4">Competiter Analysis</label>
                      </div>
                     </div>
                  </div>
                  <div className="row mb-4">
                     <div className="col-md-12">
                       <label className="form-label">Keyword (Optional)</label>
                       <textarea rows="3" className="form-control h-auto" placeholder="Enter Keywords Seperated by commas"></textarea>
                     </div>
                  </div>
                  <div className="d-flex mb-3 gap-3 justify-content-end">
                      <button type="button" className="btn btn-back my-0 px-5 w-auto fs-14">Clear</button>
                      <button type="button" className="btn btn-primary my-0 w-auto fs-14">Submit Request</button>
                  </div>
                 </div>
               </div>



               <div className="download-output d-flex align-items-center justify-content-between mb-3 mt-4">
                 <div className="">
                   <h3>Output</h3>
                 </div>
                 <div className="">
                   <div className="d-flex align-items-center gap-3">
                     <div className="">
                       <label>Download:</label>
                     </div>
                     <div className="">
                       <button className="btn btn-sm btn-file" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />XLS</button>
                     </div>
                     <div className="">
                       <button className="btn btn-sm btn-file" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="main-upload">
                 <div className="grid-view m-0 filter-input-form">
                  <h2>AI Web Research Agent Result:</h2>
                   <div className="table-responsive circular-progressbar-table">
                     <table className="table mb-4">
                       <thead>
                         <tr>
                           <th className="text-nowrap">S No</th>
                           <th>Field</th>
                           <th>Details</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <td>0</td>
                           <td>Primary Address</td>
                           <td>C/O The Corporation Trust Company, Corporation Trust Center, 1209 Orange Street, Wilmington, Delaware, 19801, United States</td>
                         </tr>
                         <tr>
                           <td>1</td>
                           <td>Legal Form</td>
                           <td>Corporation</td>
                         </tr>
                         <tr>
                           <td>2</td>
                           <td>Country</td>
                           <td>United States</td>
                         </tr>
                         <tr>
                           <td>3</td>
                           <td>Town</td>
                           <td>New York, NY</td>
                         </tr>
                         <tr>
                           <td>4</td>
                           <td>Registration on Date</td>
                           <td>April 8, 1998</td>
                         </tr>
                       </tbody>
                     </table>
                    </div>
                    <h2>Reference</h2>
                    <div className="list-references">
                     <ul>
                      <li>
                       <span className="pe-3">LEI Lookup</span>
                       <a className="view-source">https://www.exampleview/</a>
                      </li>
                      <li>
                       <span className="pe-3">LEI Lookup</span>
                       <a className="view-source">https://www.exampleview/</a>
                      </li>
                      <li>
                       <span className="pe-3">Wikipedia</span>
                       <a className="view-source">https://www.exampleview/</a>
                      </li>
                     </ul>
                     <ol>
                      <li><span className="pe-2">MarketScreener Shareholders Board Members Managers and Company Profile. Retrieved from</span>
                       <a className="view-source">https://www.exampleview/</a></li>
                       <li><span className="pe-2">Wikipedia</span><a className="view-source">https://www.exampleview/</a></li>
                     </ol>
                    </div>
                 </div>
               </div>

             </section>
            </div>
        </div>
    );
};

export default WebResearch;
