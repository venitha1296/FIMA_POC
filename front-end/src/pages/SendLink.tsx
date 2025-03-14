import "../styles/style.scss";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom


const SendLink = () => {
    const navigate = useNavigate(); // Hook for navigation
    const handleBack= () => {
        navigate('/login');
    };
    return (
        <div className="d-flex flex-xl-row flex-lg-row flex-md-column flex-column align-items-center vh-100 overflow-xl-hidden">
            <div className="login-banner position-relative h-100 d-flex justify-content-center flex-column">
                <h2>Accelerate Financial<br /> Decisions</h2>
                <p>Smarter insights with intelligent data processing.</p>
                <img className="z-1 d-none d-lg-block" src="/assets/images/login-bg.svg" alt="logo" />
                <div className="login-banner__bg-circle d-none d-lg-block">
                    <div className="login-banner__bg-circle--first-ring"></div>
                    <div className="login-banner__bg-circle--second-ring"></div>
                </div>
            </div>
            <div className="login-form">
                <div className="login-form__block py-5">
                    <img src="/assets/images/mail-open.svg" alt="site logo" />
                    <h2 className="mb-3">Reset Your Password</h2>
                    <p className="msg-label">We have sent an email to your email address with instructions to reset your password.</p>
                    <div className="d-flex gap-2">
                        <a href="/forgot" className="link-text text-line jacarta active">Submit Another Request?</a>
                    </div>
                    <div className="">
                        <button type="button" className="btn btn-primary" onClick={handleBack}>
                        Back to Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendLink;
