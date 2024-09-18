import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const userId = useSelector((state) => state.user.userId);
    // console.log("Protected Route User ID:", userId)

    return userId ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;