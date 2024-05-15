import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import config from './config';
import './App.css';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Rightbar from './pages/rightbar/Rightbar';
import Client from './pages/client/Client';
import Operations from './pages/operations/Operations';
import ClientForm from './pages/client/form/ClientForm';
import Traceur from './pages/traceur/Traceur';
import TraceurForm from './pages/traceur/form/TraceurForm';
import OperationForm from './pages/operations/form/OperationForm';
import Affectations from './pages/affectations/Affectations';

function App() {

  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

/*   const SecuriteRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  }; */

  const Layout = () => {
      
    return (
      <div className='app_wrapper'>
        <div className="appContainer">
          <Sidebar/>
          <div className="appOutlet">
            <Topbar/>
            <div className="outlet-wrapper">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path:'/',
      element: <Layout/>,
      children:[
        {
          path:'/',
          element: <Rightbar/>,
        },
        {
          path:'/client',
          element: <Client/>,
        },
        {
          path:'/client_form',
          element: <ClientForm/>,
        },
        {
          path:'/traceurs',
          element: <Traceur/>,
        },
        {
          path:'/traceurs_form',
          element: <TraceurForm/>,
        },
        {
          path:'/operations',
          element: <Operations/>,
        },
        {
          path:'/operations_form',
          element: <OperationForm/>,
        },
        {
          path:'/affectation',
          element: <Affectations/>,
        },
      ]
    },
    {
      path:'/register',
      element: <Register/>
    },
    {
      path:'/login',
      element: <Login/>
    }
  ])

  return (
    <div className="App">
      <div className="app-container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;
