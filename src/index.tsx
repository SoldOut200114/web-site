import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  useLocation,
  useRoutes,
} from "react-router-dom";

import { Footer, Header } from "./components";

import "./index.less";
import routes from "./routes";
import Context from "./context";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const App = () => {
  const GetRoutes = () => useRoutes(routes);
  const location = useLocation();
  const { pathname } = location;

  const firstPage = pathname === "/";
  console.log(pathname);

  return (
    <div className="root-app">
      {/* {!firstPage && <Header />} */}
      {firstPage && <Navigate to="/study" replace={true} />}
      <GetRoutes />
      {/* {!firstPage && <Footer />} */}
    </div>
  );
};

createRoot(document.getElementById("root") as Element).render(
  <BrowserRouter>
    <Context.Provider value={{ isMobile }}>
      <App />
    </Context.Provider>
  </BrowserRouter>
);
