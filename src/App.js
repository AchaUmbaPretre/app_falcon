import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import config from './config';
import './App.css';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Rightbar from './pages/rightbar/Rightbar';

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
        }
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
