import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { Navigate } from 'react-router';

const AgentRoute = ({children}) => {
const {user, loading}=useAuth()
const {role, roleLoading}=useRole()
console.log("from agent route", role)
console.log("from agent route", user)

if(loading || roleLoading){
    return <LoadingSpinner></LoadingSpinner>
}

if(!user || role !== 'agent'){
    return <Navigate state={{from:location.pathname}} to='/forbidden'></Navigate>
}


    return children;
};

export default AgentRoute;