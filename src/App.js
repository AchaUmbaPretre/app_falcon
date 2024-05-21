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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Vehicules from './pages/vehicules/Vehicules';
import AffectationForm from './pages/affectations/form/AffectationForm';
import Numero from './pages/numero/Numero';
import NumeroForm from './pages/numero/form/NumeroForm';
import Personnel from './pages/personnel/Personnel';
import PersonnelForm from './pages/personnel/form/PersonnelForm';
import OperationGen from './pages/operations/form/OperationGen';
import Marques from './pages/vehicules/marques/Marques';
import Vehicules_form from './pages/vehicules/form/Vehicules_form';
import Superviseur from './pages/superviseur/Superviseur';
import { useDispatch, useSelector } from 'react-redux';

function App() {

  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.currentUser);
  const loading = useSelector((state) => state.user?.loading);


  const SecuriteRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

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
      element: <SecuriteRoute><Layout /></SecuriteRoute>,
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
          element: <OperationGen/>,
        },
        {
          path:'/affectation',
          element: <Affectations/>,
        },
        {
          path:'/affectation_form',
          element: <AffectationForm/>,
        },
        {
          path:'/numero',
          element: <Numero/>,
        },
        {
          path:'/numero_form',
          element: <NumeroForm/>,
        },
        {
          path:'/vehicules',
          element: <Vehicules/>,
        },
        {
          path:'/vehicule_form',
          element: <Vehicules_form/>,
        },
        {
          path:'/marques',
          element: <Marques/>,
        },
        {
          path:'/personnel',
          element: <Personnel/>,
        },
        {
          path:'/personnel_form',
          element: <PersonnelForm/>,
        },
        {
          path:'/superviseur',
          element: <Superviseur/>,
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
     <ToastContainer />
      <div className="app-container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;
