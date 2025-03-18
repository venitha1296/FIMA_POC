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
import { exportExcel, exportJSON } from "../utils/exportUtils";

interface CountryOption {
  value: string;
  label: string;
  code: string;
}

interface ExtractedData {
  [key: string]: {
    [key: string]: string | number | Array<any> | object;
  };
}

interface OutputData {
  extracted_data: ExtractedData;
  downloaded_files: string[];
  metadata: {
    input_parameters: {
      company_name: string;
      country: string;
    };
    source: string;
    payment_details: {
      transaction_id: string;
      amount_paid: string;
      timestamp: string;
    };
    request_status: {
      success: boolean;
      failure_reason: string;
      request_timestamp: string;
    };
  };
}

const CorporateRegistry: React.FC = () => {
  const [percentage, setPercentage] = useState<number>(0);
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
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputData, setOutputData] = useState<OutputData | null>(null);
  const statusCheckInterval = useRef<number | null>(null);
  const progressInterval = useRef<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

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

  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Add this useEffect after the existing useEffects
  useEffect(() => {
    if (requestId) {
      console.log("requestId changed, starting status check:", requestId);
      // Clear any existing interval
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
      // Start new interval
      statusCheckInterval.current = setInterval(checkRequestStatus, 30000);  
      // Do initial check immediately
      checkRequestStatus();
    }
  }, [requestId]);

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

  const checkRequestStatus = async () => {
    try {
      if (!requestId) {
        console.error('No requestId available for status check');
        return;
      }

      console.log("Checking status for requestId:", requestId);
      const response = await ApiFinder.get(`/agents/status/${requestId}`);
      console.log("Status check response:", response.data);

      if (response?.data?.success) {
        const status = response.data.data.status;
        console.log("Current status:", status);

        if (status === 'Completed') {
          // Clear intervals
          if (statusCheckInterval.current) {
            clearInterval(statusCheckInterval.current);
          }
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }

          // Call new API to get output data
          try {
            const outputResponse = await ApiFinder.get(`/agents/${requestId}/output`);
            console.log("Output data response:", outputResponse.data);

            if (outputResponse?.data?.success) {
              // Set progress to 99%
              setPercentage(99);

              // Wait for 1 second to show 99%
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Set progress to 100%
              setPercentage(100);

              // Wait for 1 second to show 100%
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Then show output
              setShowProgress(false);
              setShowOutput(true);
              setOutputData(outputResponse.data.data.agentOutput.file_output.data);
              setIsSearchDisabled(false);

              toast.success('Output generated successfully!', {
                icon: <i className="bi bi-check-circle-fill"></i>,
                className: "toast-success",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            } else {
              throw new Error(outputResponse?.data?.message || 'Failed to fetch output data');
            }
          } catch (outputError: any) {
            console.error('Error fetching output data:', outputError);
            toast.error(outputError.message || 'Failed to fetch output data', {
              icon: <i className="bi bi-exclamation-triangle-fill"></i>,
              className: "toast-error",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } else if (status === 'Failed') {
          // Clear intervals
          if (statusCheckInterval.current) {
            clearInterval(statusCheckInterval.current);
          }
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }

          setShowProgress(false);
          setIsSearchDisabled(false);
          setPercentage(0);

          toast.error('Request failed! Please try again.', {
            icon: <i className="bi bi-exclamation-triangle-fill"></i>,
            className: "toast-error",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } catch (error: any) {
      console.error('Error checking status:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          icon: <i className="bi bi-exclamation-triangle-fill"></i>,
          className: "toast-error",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const startProgressAnimation = () => {
    setPercentage(0);
    let currentPercentage = 0;
    
    // Start faster (0-50% in 30 seconds)
    const fastInterval = setInterval(() => {
      currentPercentage += 1.67; // 50% in 30 seconds
      if (currentPercentage >= 50) {
        clearInterval(fastInterval);
        // Then slow down (50-90% in 4.5 minutes)
        const slowInterval = setInterval(() => {
          currentPercentage += 0.15; // 40% in 4.5 minutes
          if (currentPercentage >= 90) {
            clearInterval(slowInterval);
            setPercentage(90);
          } else {
            setPercentage(Math.round(currentPercentage));
          }
        }, 1000);
      } else {
        setPercentage(Math.round(currentPercentage));
      }
    }, 1000);

    // Store the interval reference
    progressInterval.current = fastInterval;
  };

  const handleSearchRegistry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowProgress(false);
      setShowOutput(false);
      setOutputData(null);

      // Make API call to search registry
      const response = await ApiFinder.post('/agents', {
        type: 'Corporate Registry Agent',
        company,
        country
      });

      // Handle successful response
      console.log('Search response:', response.data);
      if (response?.data?.success) {
        const requestId = response.data.data.requestId;
        console.log("Setting requestId:", requestId);

        if (!requestId) {
          throw new Error('No requestId received from the server');
        }

        setShowProgress(true);
        setRequestId(requestId);
        setIsSearchDisabled(true);
        startProgressAnimation();

        toast.success('Agent Request Created Successfully!', {
          icon: <i className="bi bi-check-circle-fill"></i>,
          className: "toast-success",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setIsSearchDisabled(false);
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
      setIsSearchDisabled(false);
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errorMessage = err.response.data.errors.map((error: any) => error.msg).join(', ');
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
      console.error('Search error:', err.response?.data?.errors);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setcompany("");
    setCountry("");
    setError(null);
    setShowOutput(false);
    setOutputData(null);
    setShowProgress(false);
    setPercentage(0);
    setOtp(['', '', '', '', '', '']);
    setIsSearchDisabled(false);
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
      const response = await ApiFinder.post('/agents/otp/update', {
        otp: otpValue,
        requestId
      });

      if (response?.data?.success) {
        // Clear OTP input after successful verification
        setOtp(['', '', '', '', '', '']);
        // Focus on the first OTP input
        otpInputs[0]?.focus();

        toast.success('OTP updated successfully!', {
          icon: <i className="bi bi-check-circle-fill"></i>,
          className: "toast-success",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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

  const handleViewS3File = async (filePath: string) => {
    try {
      setIsLoading(true);
      // Make API call to get pre-signed URL
      const response = await ApiFinder.post('/agents/get-s3-url', {
        filePath: filePath
      });

      if (response?.data?.success) {
        // Open the pre-signed URL in a new tab
        window.open(response.data.data.url, '_blank');
      } else {
        throw new Error('Failed to get file URL');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to open file', {
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

  const handleDownload = async (type: 'excel' | 'json') => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      if (outputData) {
        const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
        const fileName = `${timestamp}`;
        
        // Show initial progress
        setDownloadProgress(30);
        
        if (type === 'excel') {
          await exportExcel(outputData, fileName);
        } else {
          await exportJSON(outputData, fileName);
        }
        
        // Show completion
        setDownloadProgress(100);
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed!', {
        icon: <i className="bi bi-exclamation-triangle-fill"></i>,
        className: "toast-error",
        autoClose: 2000,
      });
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
      <div className="main-section">
        <Header handleLogout={handleLogout} />
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
                          disabled={isLoading || isSearchDisabled}
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
                          disabled={isLoading || isSearchDisabled}
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
                        className="btn btn-primary fs-14 my-0"
                        onClick={handleSearchRegistry}
                        disabled={isLoading || !company || !country || isSearchDisabled}
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

          {showProgress && !showOutput && (
            <div className="main-upload mt-4">
              <div className="filter-input-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2 className="text-center mb-3">Enter OTP Verification Code</h2>
                <p className="text-center mb-4">Please enter the 6-digit code sent to your registered phone number</p>
                <div className="d-flex justify-content-center gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <div key={index} style={{ width: '45px' }}>
                      <input
                        type="text"
                        className="form-control text-center"
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
                <div className="text-center">
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
                      'Save OTP'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showProgress && (
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
          )}

          {showOutput && outputData && (
            <>
              <div className="download-output d-flex align-items-center justify-content-between mb-3 mt-4">
                <div className="">
                  <h3>Output</h3>
                </div>
                <div className="">
                  <div className="d-flex align-items-center gap-3" style={{ position: 'relative' }}>
                    <div className="">
                      <label>Download:</label>
                    </div>
                    <div className="">
                      <button 
                        className="btn btn-sm btn-file" 
                        type="button"
                        onClick={() => handleDownload('excel')}
                        disabled={isDownloading}
                      >
                        <img className="" src="/assets/images/file-download-blue.svg" alt="" />
                        {isDownloading ? 'Downloading...' : 'XLS'}
                      </button>
                    </div>
                    <div className="">
                      <button 
                        className="btn btn-sm btn-file" 
                        type="button"
                        onClick={() => handleDownload('json')}
                        disabled={isDownloading}
                      >
                        <img className="" src="/assets/images/file-download-blue.svg" alt="" />
                        {isDownloading ? 'Downloading...' : 'JSON'}
                      </button>
                    </div>
                    {isDownloading && (
                        <div className="download-progress" style={{ 
                          position: 'fixed', 
                          top: '20px', 
                          right: '20px', 
                          backgroundColor: 'white', 
                          padding: '15px', 
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                          borderRadius: '4px', 
                          width: '300px', 
                          zIndex: 1050 
                        }}>
                          <div className="mb-2">Download Initiated</div>
                          <div className="progress" style={{ height: '6px', backgroundColor: '#e9ecef' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${downloadProgress}%`,
                                backgroundColor: '#28a745',
                                transition: 'width 0.3s ease-in-out'
                              }}
                              aria-valuenow={downloadProgress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="main-upload">
                <div className="grid-view m-0 filter-input-form">
                  <div className="output-data-container" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                    {outputData.extracted_data && Object.entries(outputData.extracted_data).map(([section, data], index) => (
                      <div key={section} className="mb-4">
                        <h4 className="section-title mb-3">{section}</h4>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            {Array.isArray(data) ? (
                              <>
                                <thead className="table-light">
                                  <tr>
                                    {Object.keys(data[0] || {}).map(key => (
                                      <th key={key} style={{ backgroundColor: '#f8f9fa', fontWeight: '600' }}>{key}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((item, idx) => (
                                    <tr key={idx}>
                                      {Object.values(item).map((value, valIdx) => (
                                        <td key={valIdx}>{value as string}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </>
                            ) : (
                              <tbody>
                                {Object.entries(data as Record<string, any>).map(([key, value]) => (
                                  <tr key={key}>
                                    <th style={{ width: '40%', backgroundColor: '#f8f9fa', fontWeight: '600' }}>{key}</th>
                                    <td>
                                      {Array.isArray(value) ? (
                                        <ul className="list-unstyled mb-0">
                                          {value.map((item, idx) => (
                                            <li key={idx}>
                                              {typeof item === 'object'
                                                ? Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(' - ')
                                                : item}
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        value as string
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>
                    ))}

                    {outputData.downloaded_files && outputData.downloaded_files.length > 0 && (
                      <div className="mb-4">
                        <h4 className="section-title mb-3">Source Documents</h4>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th style={{ backgroundColor: '#f8f9fa', fontWeight: '600', width: '75%' }}>Document Name</th>
                                <th style={{ backgroundColor: '#f8f9fa', fontWeight: '600', width: '20%' }}>View</th>
                              </tr>
                            </thead>
                            <tbody>
                              {outputData.downloaded_files.map((file, index) => {
                                const fileName = file.split('/').pop() || file;
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <img src="/assets/images/file-download-blue.svg" alt="" className="me-2" style={{ width: '20px' }} />
                                        <span>{fileName}</span>
                                      </div>
                                    </td>
                                    <td>
                                      <button 
                                        className="btn btn-view" 
                                        type="button"
                                        onClick={() => handleViewS3File(file)}
                                        disabled={isLoading}
                                      >
                                        <i className="bi bi-eye"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>


            </>
          )}

        </section>
        <ToastContainer />
      </div>
    </div >

  );
};

export default CorporateRegistry;
