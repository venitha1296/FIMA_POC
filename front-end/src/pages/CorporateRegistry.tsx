import "../styles/style.scss";
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CorporateRegistry: React.FC = () => {
const percentage = 50;


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
                        <div className="profile-name">Selvam</div>
                        <div className="dropdown">
                          <img className="profile-image img-fluid cursor" data-bs-toggle="dropdown"
                          src="/assets/images/profile-pic.jpg" alt="" />
                          <ul className="dropdown-menu py-1 border-0 shadow-sm">
                            <li>
                             <a className="dropdown-item border-bottom fs-14 cursor jacarta" href="">My Profile</a>
                            </li>
                            <li><a className="dropdown-item text-danger fs-14 cursor">Logout</a></li>
                          </ul>
                        </div>
                    </div>
                </div>
            </header>
            <section>
              <div className="main-upload">

                <div className="breadcrumb">
                 <ul className="d-flex align-items-center gap-2">
                  <li><a href="">Home</a></li>
                  <li>
                   <img src="/assets/images/bread-right.svg" alt="right-arrow" />
                  </li>
                  <li><a href="" className="active">Corporate Registry Agent</a></li>
                 </ul>
                </div>

                <div className="filter-input-form">
                 <h2>Search for company information across official registries</h2>
                 <p>Get Real time business insights from diverse media sources search a company by specifying name and region.</p>
                 <div className="row align-items-end">
                  <div className="col-md-9">
                    <div className="row">
                     <div className="col-md-6">
                      <div className="">
                        <label className="form-label">Company Name</label>
                        <input disabled type="email" className="form-control opacity-50" placeholder="Enter Company Name" />
                      </div>
                     </div>
                     <div className="col-md-6">
                       <div className="">
                          <label className="form-label">Country</label>
                          <select disabled className="form-select opacity-50">
                            <option selected>Select Country</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                       </div>
                     </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="row">
                     <div className="col-md-5 pe-0">
                       <button disabled type="button" className="btn btn-back fs-14 my-0 opacity-50">Clear</button>
                     </div>
                     <div className="col-md-7">
                       <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-primary fs-14 my-0 opacity-50">Search Registry</button>
                     </div>
                    </div>
                  </div>
                 </div>
                </div>
              </div>

              <div className="document-upload-progressbar" style={{ width: 150, height: 150 }}>
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textSize: '24px',
                  pathTransitionDuration: 0.5,
                })}
                />
                <p>Generating report... Please wait </p>
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
                 <h2>Corporate Date</h2>
                 <h3>Organization Details</h3>
                  <div className="table-responsive circular-progressbar-table">
                    <table className="table mb-4">
                      <thead>
                        <tr>
                          <th>S No</th>
                          <th>Field</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>0</td>
                          <td>Name</td>
                          <td>SOMARO LIMITED</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Registration Number</td>
                          <td>HE 84386</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Type</td>
                          <td>Limited Company</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Subtype</td>
                          <td>Private</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>Name Status</td>
                          <td>Current Name</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>Registration Date</td>
                          <td>25/02/1997</td>
                        </tr>
                      </tbody>
                    </table>
                   </div>
                </div>
              </div>

              <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-otp">
                  <div className="modal-content">
                    <div className="modal-body ">
                      <h2 className="">Enter OTP Verification Code</h2>
                      <p className="">Please enter the 6-digit code sent to your registered company email address</p>
                      <div className="row mb-3 mx-0">
                       <div className="col px-1">
                        <input type="text" className="form-control filled" />
                       </div>
                       <div className="col px-1">
                        <input type="text" className="form-control verified" />
                       </div>
                       <div className="col px-1">
                        <input type="text" className="form-control" />
                       </div>
                       <div className="col px-1">
                        <input type="text" className="form-control" />
                       </div>
                       <div className="col px-1">
                        <input type="text" className="form-control" />
                       </div>
                      </div>
                      <div className="PickledBluewood fs-14 text-700 d-flex justify-content-center align-items-center gap-2 mb-3"><i className="bi bi-check-circle-fill icon-success"></i>Success</div>
                      <button type="button" className="btn btn-primary fs-14 my-0">Verify<span class="spinner-border text-light"></span></button>
                      <div className="d-flex mt-3 gap-2">
                        <a className="fs-12 text-600 RiverBed">Didn’t receive coe ? </a>
                        <a href="/signup" className="link-text text-600 cobalt fs-12">Resend in 20s</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>
        </div>
      </div>

    );
};

export default CorporateRegistry;
