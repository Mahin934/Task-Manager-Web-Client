import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../pages/Loading";
import { AuthContext } from "../providers/AuthProvider";



const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // Display loading component while checking authentication
    if (loading) {
        return <Loading />;
    }

    // If user is authenticated, allow access to the children
    if (user && user.email) {
        return children;
    }

    // Redirect to login with the current path stored in state
    return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
