import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import LoadingSpinner from '../Shared/LoadingSpinner';

const PrivetRoutes = ({children}) => {
    const {user, loading}=useAuth();
    const location =useLocation()
    
    if(loading){
        return <LoadingSpinner></LoadingSpinner>
    }

    if(!user){
        return <Navigate to='/login'state={{ from:location.pathname }}></Navigate>
    }
    return children;
};

export default PrivetRoutes;