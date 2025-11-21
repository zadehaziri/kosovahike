import { RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { App as AntdApp } from "antd";
import "./App.css";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./routes/new-routes/PublicRoutes";
import PrivateRoutes from "./routes/new-routes/PrivateRoutes";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  const loggedUser = useSelector((state) => state.loggedUser);

  const router = createBrowserRouter([
    !!loggedUser.token ? PrivateRoutes() : {},
    PublicRoutes(),
  ]);

  return (
    <ErrorBoundary>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ErrorBoundary>
  );
}

export default App;
