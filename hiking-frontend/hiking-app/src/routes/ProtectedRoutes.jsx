import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoutes = ({ children }) => {
  const token = useSelector((state) => state.loggedUser.token);
  if (!token || token === null) {
    return <Navigate to="/login" />;
  }
  return children;
};
