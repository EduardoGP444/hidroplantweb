

import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import Home from "./components/home";

import Monitoreo from "./components/home/monitoreo";
import Historial from "./components/home/historial";
import Perfil from "./components/home/perfil";


import { AuthProvider } from "./contexts/authContext";
import { useRoutes, useLocation } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },

    {
      path: "/monitoreo",
      element: <Monitoreo />,
    },
    {
      path: "/historial",
      element: <Historial />,
    },
    {
      path: "/perfil",
      element: <Perfil />,
    },
    

  ];
  const location = useLocation();
  const isHomeOrParametrosRoute = location.pathname === '/home' || location.pathname === '/monitoreo' || location.pathname === '/historial' || location.pathname === '/perfil';

  let routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      {isHomeOrParametrosRoute && <Header />} {}
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
