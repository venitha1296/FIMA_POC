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





function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/forgot', element: <ForgotPassword /> },
    { path: '/sendLink', element: <SendLink /> },
    { path: '/reset', element: <ResetPassword /> },
    { path: '/dashboard', element: <Protected Component={Dashboard} /> },
   
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App;

