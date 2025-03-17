import "../styles/style.scss";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useState, useEffect, useRef } from "react";
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ApiFinder from "../apis/ApiFinder";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file

interface CountryOption {
  value: string;
  label: string;
  code: string;
}

const CorporateRegistry: React.FC = () => {
  const percentage: number = 50;
  const [profileName, setProfileName] = useState<string>("User");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [company, setcompany] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpInputs, setOtpInputs] = useState<HTMLInputElement[]>([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [requestId, setRequestId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await ApiFinder.get('/agents/countries');
        const countriesData = response.data.map(({ name, code }: { name: string; code: string }) => ({
          value: name,
          label: name,
          code: code
        }));
        setCountries(countriesData);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        setError("Failed to load countries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogout = async () => {
    try {
      await ApiFinder.post('/auth/logout');
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const handleSearchRegistry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowProgress(false);

      // Make API call to search registry
      const response = await ApiFinder.post('/agents', {
        type: 'Corporate Registry Agent',
        company,
        country
      });

      // Handle successful response
      console.log('Search response:', response.data);
      if (response?.data?.success) {
        setShowProgress(true);
        setShowOtpModal(true);
        setRequestId(response.data.data.requestId); // Store the requestId from response
        toast.success('Agent Request Created Successfully! Please enter OTP sent to your phone.', {
          icon: <i className="bi bi-check-circle-fill"></i>,
          className: "toast-success",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Request Failed!", {
          icon: <i className="bi bi-exclamation-triangle-fill"></i>,
          className: "toast-error",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

    } catch (err: any) {
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errorMessage = err.response.data.errors.map((error: any) => error.msg).join(', ');
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
      } else {
        let errorMessage = err.response?.data?.message || 'An error occurred while searching the registry';

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
      }
      console.error('Search error:', err.response.data.errors);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setcompany("");
    setCountry("");
    setError(null);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      otpInputs[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP", {
        icon: <i className="bi bi-exclamation-triangle-fill"></i>,
        className: "toast-error",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await ApiFinder.post('/agents/otp-update', {
        otp: otpValue,
        requestId // Include requestId in the OTP verification request
      });

      if (response?.data?.success) {
        setShowOtpModal(false);
        toast.success('OTP verified successfully!', {
          icon: <i className="bi bi-check-circle-fill"></i>,
          className: "toast-success",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Handle successful verification
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP', {
        icon: <i className="bi bi-exclamation-triangle-fill"></i>,
        className: "toast-error",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
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
                <li><Link to="/dashboard">Home</Link></li>
                <li>
                  <img src="/assets/images/bread-right.svg" alt="right-arrow" />
                </li>
                <li><Link to="" className="active">Corporate Registry Agent</Link></li>
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
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Company Name"
                          value={company}
                          onChange={(e) => setcompany(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="">
                        <label className="form-label">Country</label>
                        <select
                          className="form-select"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          disabled={isLoading}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="row">
                    <div className="col-md-5 pe-0">
                      <button
                        type="button"
                        className="btn btn-back fs-14 my-0"
                        onClick={handleClear}
                        disabled={isLoading}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="col-md-7">
                      <button
                        type="button"
                        // data-bs-toggle="modal" 
                        // data-bs-target="#exampleModal" 
                        className="btn btn-primary fs-14 my-0"
                        onClick={handleSearchRegistry}
                        disabled={isLoading || !company || !country}
                      >
                        {isLoading ? (
                          <>
                            Searching...
                            <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                          </>
                        ) : (
                          'Search Registry'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>

          {showProgress && (
            <div className="document-upload-progressbar" style={{ width: 150, height: 150 }}>
              <CircularProgressbar
                value={Number(percentage)}
                text={`${percentage}%`}
                styles={buildStyles({
                  textSize: '24px',
                  pathTransitionDuration: 0.5,
                })}
              />
              <p>Generating report... Please wait </p>
            </div>
          )}

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

          <div className={`modal fade ${showOtpModal ? 'show' : ''}`} id="exampleModal" style={{ display: showOtpModal ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered modal-otp">
              <div className="modal-content">
                <div className="modal-body">
                  <h2 className="">Enter OTP Verification Code</h2>
                  <p className="">Please enter the 6-digit code sent to your registered phone number</p>
                  <div className="row mb-3 mx-0">
                    {otp.map((digit, index) => (
                      <div key={index} className="col px-1">
                        <input
                          type="text"
                          className="form-control"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          ref={(el) => {
                            if (el) otpInputs[index] = el;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary fs-14 my-0"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        Updating...
                        <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                      </>
                    ) : (
                      'Verify'
                    )}
                  </button>
                  {/* <div className="d-flex mt-3 gap-2">
                    <span className="fs-12 text-600 RiverBed">Didn't receive code? </span>
                    <button 
                      className="link-text text-600 cobalt fs-12 border-0 bg-transparent"
                      onClick={() => handleSearchRegistry()}
                      disabled={isLoading}
                    >
                      Resend in 20s
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

        </section>
        <ToastContainer />
      </div>
    </div >

  );
};

export default CorporateRegistry;
