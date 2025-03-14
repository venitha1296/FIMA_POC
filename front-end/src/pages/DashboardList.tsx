
import "../styles/style.scss";

const DashboardList: React.FC = () => {


    return (
        <div className="d-flex">
          <aside className="sidebar">
              <div className="sidebar--logo">
                  <img className="img-fluid" alt="logo" src="/assets/images/header-logo.svg" />
              </div>
              <i className="bi bi-code"></i>
              <ul>
                  <li><a href="" className="active"><img src="/assets/images/menu-home.svg" alt="home" />Home</a></li>
                  <li><a href=""><img src="/assets/images/menu-document-code.svg" alt="all" />All Data Agents</a></li>
                  <li><a href=""><img src="/assets/images/menu-building-4.svg" alt="corporate" />Corporate Registry Agent</a></li>
                  <li><a href=""><img src="/assets/images/menu-send.svg" alt="finance" />Financial Data Agent</a></li>
                  <li><a href=""><img src="/assets/images/home-global-search.svg" alt="web" />Web Research Media Agent</a></li>
              </ul>
          </aside>
          <div className="main-section">
              <header>
                  <div className="d-flex justify-content-end">
                      <div className="d-flex align-items-center">
                          <div className="profile-name">{profileName}</div>
                          <div className="dropdown">
                            <img className="profile-image img-fluid cursor" data-bs-toggle="dropdown"
                            src="/assets/images/profile-pic.jpg" alt="" />
                            <ul className="dropdown-menu py-1 border-0 shadow-sm">
                              <li><a className="dropdown-item border-bottom fs-14 cursor jacarta" href="">My Profile</a></li>
                              <li><a className="dropdown-item text-danger fs-14 cursor" onClick={handleLogout}>Logout</a></li>
                            </ul>
                          </div>
                      </div>
                  </div>
              </header>
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
                        <tr>
                         <td>01</td>
                         <td>Platinum Equity Holdings</td>
                         <td>USA</td>
                         <td><span className="badge badge-completed">Completed</span></td>
                         <td>12-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
                        <tr>
                         <td>02</td>
                         <td>Clearlake Capital Group</td>
                         <td>Germany</td>
                         <td><span className="badge badge-processing">Processing</span></td>
                         <td>10-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
                        <tr>
                         <td>03</td>
                         <td>Clearlake Capital Group</td>
                         <td>Germany</td>
                         <td><span className="badge badge-completed">Completed</span></td>
                         <td>10-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
                        <tr>
                         <td>04</td>
                         <td>Clearlake Capital Group</td>
                         <td>Germany</td>
                         <td><span className="badge badge-processing">Processing</span></td>
                         <td>10-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
                        <tr>
                         <td>05</td>
                         <td>Clearlake Capital Group</td>
                         <td>Germany</td>
                         <td><span className="badge badge-processing">Processing</span></td>
                         <td>10-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
                        <tr>
                         <td>06</td>
                         <td>Clearlake Capital Group</td>
                         <td>Germany</td>
                         <td><span className="badge badge-completed">Completed</span></td>
                         <td>10-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
                        <tr>
                         <td>07</td>
                         <td>Clearlake Capital Group</td>
                         <td>Germany</td>
                         <td><span className="badge badge-processing">Processing</span></td>
                         <td>10-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
                        <tr>
                         <td>08</td>
                         <td>Clearlake Capital Group</td>
                         <td>Germany</td>
                         <td><span className="badge badge-completed">Completed</span></td>
                         <td>10-Feb-2025</td>
                         <td><a href="" className="text-line">View Source</a></td>
                         <td>
                          <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-download btn-download-green" type="button"><img className="" src="/assets/images/file-download-green.svg" alt="" />XLS</button>
                          <button className="btn btn-sm btn-download btn-download-blue" type="button"><img className="" src="/assets/images/file-download-blue.svg" alt="" />JSON</button></div>
                         </td>
                         <td>
                          <button className="btn btn-view" type="button"><i className="bi bi-eye"></i></button>
                         </td>
                        </tr>
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



                  </div>
                  <div className="tab-pane" id="fd-agent-panel" role="tabpanel" aria-labelledby="fd-agent">Financial Data Agent</div>
                  <div className="tab-pane" id="wrm-agent-panel" role="tabpanel" aria-labelledby="wrm-agent">Web Research Media Agent</div>
                </div>
              </div>


              </section>
          </div>
        </div>

    );
};

export default DashboardList;
