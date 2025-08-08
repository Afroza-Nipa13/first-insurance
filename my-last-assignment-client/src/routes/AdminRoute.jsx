import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { Navigate } from 'react-router';

const AdminRoute = ({children}) => {
    const {user, loading}=useAuth()
    const {role, roleLoading}= useRole()

    if(loading || roleLoading){
        return <LoadingSpinner></LoadingSpinner>
    }

    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }
    return children;
};

export default AdminRoute;