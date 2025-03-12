import "../styles/style.scss";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file
import "bootstrap-icons/font/bootstrap-icons.css";


const SendLink = () => {
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
                <div className="login-form__block">
                    <img src="/assets/images/login-logo.svg" alt="site logo" />
                    <h2>Reset Password Link</h2>
                    <p>If the email you submitted was found on our database we will send you
                            a one time link to reset your password. <br /><br />If you do not
                            recieve an email (check your junk mail) then &nbsp; </p>
                    <div className="d-flex gap-2">
                        <a href="/forgot" className="link-text text-line jacarta active">Submit Another Request?</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendLink;
