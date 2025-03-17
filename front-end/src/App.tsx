import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import SendLink from './pages/SendLink';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Protected from './pages/Protected';
import DashboardList from './pages/DashboardList';
import CorporateRegistry from './pages/CorporateRegistry';
import ChangePassword from './pages/ChangePassword';
import Finance from './pages/Finance';
import WebResearch from './pages/WebResearch';





function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/forgot', element: <ForgotPassword /> },
    { path: '/sendLink', element: <SendLink /> },
    { path: '/reset', element: <ResetPassword /> },
    { path: '/dashboard', element: <Protected Component={Dashboard} /> },
    { path: '/agents', element: <Protected Component={DashboardList} /> },
    { path: '/corporate-registry', element: <Protected Component={CorporateRegistry} /> },
    { path: '/change-password', element: <Protected Component={ChangePassword} /> },
    { path: '/finance-data-agent', element: <Finance /> },
    { path: '/web-research-agent', element: <WebResearch /> },

  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App;
