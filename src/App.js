import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import config from './config';
import Rightbar from './pages/rightbar/Rightbar';
import Client from './pages/client/Client';
import Operations from './pages/operations/Operations';
import ClientForm from './pages/client/form/ClientForm';
import Traceur from './pages/traceur/Traceur';
import TraceurForm from './pages/traceur/form/TraceurForm';
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
import Vehicules_form from './pages/vehicules/form/VehiculesForm';
import Superviseur from './pages/superviseur/Superviseur';
import SuperviseurNavbar from './pages/superviseur/navbar/SuperviseurNavbar';
import SuperviseurInstallation from './pages/superviseur/form/superviseurInstallation/SuperviseurInstallation';
import SuperviseurControle from './pages/superviseur/form/superviseurControle/SuperviseurControle';
import SuperviseurDement from './pages/superviseur/form/superviseurDemantelement/SuperviseurDement';
import Marque_form from './pages/vehicules/marques/form/Marque_form';
import axios from 'axios';
import SuperviseurTransfert from './pages/superviseur/form/superviseurTransfert/SuperviseurTransfert';
import SuperviseurRemplace from './pages/superviseur/form/superviseurRemplacement/SuperviseurRemplace';
import Page405 from './pages/page404/page405';
import Page404 from './pages/page404/Page404';
import Sites from './pages/sites/Sites';
import Permissions from './pages/permissions/Permissions';
import Recharge from './pages/recharge/Recharge';
import Recharge_form from './pages/recharge/form/Recharge_form';
import RechargeOne from './pages/recharge/rechargeOne/RechargeOne';
import Paiement from './pages/paiement/Paiement';
import Dette from './pages/dette/Dette';
import Depenses from './pages/depenses/Depenses';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Rapport from './pages/rapport/Rapport';
import PassWordForgot from './pages/passwordForgot/PassWordForgot';

function App() {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const user = useSelector((state) => state.user?.currentUser);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/users`);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const SecuriteRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="loading-container">
          <ScaleLoader size="large" color="rgb(131, 159, 241)" />
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const Layout = () => (
    <div className='app_wrapper'>
      <div className="appContainer">
        <Sidebar />
        <div className="appOutlet">
          <Topbar />
          <div className="outlet-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );

  const Layout2 = () => (
    <div>
      <SuperviseurNavbar />
      <div className="pageNavbar">
        <Outlet />
      </div>
    </div>
  );

  const adminOrSecretaireRoutes = (user?.role === 'admin' || user?.role === 'secretaire') ? [
    {
      path: '/',
      element: <SecuriteRoute><Layout /></SecuriteRoute>,
      children: [
        { path: '/', element: <Rightbar /> },
        { path: '/client', element: <Client /> },
        { path: '/client_form', element: <ClientForm /> },
        { path: '/sites', element: <Sites /> },
        { path: '/traceurs', element: <Traceur /> },
        { path: '/traceurs_form', element: <TraceurForm /> },
        { path: '/operations', element: <Operations /> },
        { path: '/operations_form', element: <OperationGen /> },
        { path: '/affectation', element: <Affectations /> },
        { path: '/affectation_form', element: <AffectationForm /> },
        { path: '/numero', element: <Numero /> },
        { path: '/numero_form', element: <NumeroForm /> },
        { path: '/vehicules', element: <Vehicules /> },
        { path: '/vehicule_form', element: <Vehicules_form /> },
        { path: '/marques', element: <Marques /> },
        { path: '/marque_form', element: <Marque_form /> },
        { path: '/recharge', element: <Recharge /> },
        { path: '/recharge_form', element: <Recharge_form /> },
        { path: '/rechargeOne', element: <RechargeOne /> },
        { path: '/personnel', element: <Personnel /> },
        { path: '/personnel_form', element: <PersonnelForm /> },
        { path: '/paiement', element: <Paiement /> },
        { path: '/rapport', element: <Rapport /> },
        { path: '/dette', element: <Dette /> },
        { path: '/depense', element: <Depenses /> },
        { path: '/permissions', element: <Permissions /> },
      ]
    }
  ] : [];

  const superviseurRoutes = (user?.role === 'superviseur') ? [
    {
      path: '/',
      element: <SecuriteRoute><Layout2 /></SecuriteRoute>,
      children: [
        { path: '/', element: <Superviseur /> },
        { path: '/installation', element: <SuperviseurInstallation /> },
        { path: '/controle_technique', element: <SuperviseurControle /> },
        { path: '/demantelement', element: <SuperviseurDement /> },
        { path: '/transfert', element: <SuperviseurTransfert /> },
        { path: '/remplacement', element: <SuperviseurRemplace /> },
      ]
    }
  ] : [];

  const routes = [
    ...adminOrSecretaireRoutes,
    ...superviseurRoutes,
    { path: '/register', element: <Register /> },
    { path: '/login', element: <Login /> },
    { path: '/forgot', element: <PassWordForgot /> },
    user?.role === null && {
      path: '/*',
      element: <Page405 />
    },
    {
      path: '/*',
      element:<SecuriteRoute><Page404 /></SecuriteRoute>
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    <div className="App">
      <ToastContainer />
      <div className="app-container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
