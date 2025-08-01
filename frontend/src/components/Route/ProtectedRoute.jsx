import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Forbidden from '../Utils/Forbidden';

const ProtectedRoute = ({ isAdmin }) => {
    const navigate = useNavigate();
    const { isAuthenticated, loading, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (!loading) {
            // Redirect unauthenticated users trying to access protected routes
            if (!isAuthenticated && !isAdmin) {
                navigate('/login', { replace: true });
            }
            // Redirect non-admin users trying to access admin routes
            if (isAdmin && (!user || user.role !== 'admin')) {
                navigate('/', { replace: true });
            }
        }
    }, [isAdmin, loading, navigate, isAuthenticated, user]);

    if (loading) {
        return null; // or return a loading spinner
    }

    // Check for admin access
    if (isAdmin && (!user || user.role !== 'admin')) {
        return <Forbidden />;
    }

    // Check for authenticated user access
    if (!isAuthenticated) {
        return <Forbidden />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Outlet, useNavigate } from 'react-router-dom';
// import Forbidden from '../Utils/Forbidden';

// const ProtectedRoute = ({ isAdmin }) => {
//     const navigate = useNavigate();
//     const { isAuthenticated, loading, user } = useSelector((state) => state.user);

//     useEffect(() => {
//         if (!loading && isAuthenticated) {
//             if (!isAdmin && !user) {
//                 return <Forbidden />;
//             }
//         }
//     }, [isAdmin, loading, navigate, isAuthenticated, user]);

//     // When user role is user
//     if (isAdmin && (!user || user.role !== 'admin')) {
//         return <Forbidden />;
//     }

//     // When user is guest
//     if (!isAdmin && !isAuthenticated) {
//         return <Forbidden />;
//     }

//     return <Outlet />;
// }

// export default ProtectedRoute;
