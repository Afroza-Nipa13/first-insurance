import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { Navigate } from 'react-router';

const AdminAgentRoute = ({children}) => {
    const {user, loading}=useAuth()
    const {role, isLoading}= useRole()

    if(loading || isLoading){
        return <LoadingSpinner></LoadingSpinner>
    }

    if (!user || role == 'customer') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }
    return children;
};


export default AdminAgentRoute;