import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  role: "STAFF" | "ADMIN";
}

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("staffToken");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    if (decoded.role !== "ADMIN") {
      return <Navigate to="/" />;
    }

    return children;
  } catch {
    return <Navigate to="/" />;
  }
};

export default RequireAdmin;
