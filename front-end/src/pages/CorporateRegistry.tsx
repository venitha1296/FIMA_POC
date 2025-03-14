import "../styles/style.scss";

const CorporateRegistry: React.FC = () => {


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
                            <li><a className="dropdown-item border-bottom fs-14 cursor jacarta" href="">My Profile</a></li>
                            <li><a className="dropdown-item text-danger fs-14 cursor">Logout</a></li>
                          </ul>
                        </div>
                    </div>
                </div>
            </header>
            <section>

            


            </section>
        </div>
      </div>

    );
};

export default CorporateRegistry;
