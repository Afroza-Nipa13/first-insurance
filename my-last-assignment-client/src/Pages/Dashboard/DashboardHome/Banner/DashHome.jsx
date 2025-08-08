import React from 'react';
import useRole from '../../../../Hooks/useRole';
import AdminHome from './AdminHome';
import AgentHome from './AgentHome';
import CustomerHome from './CustomerHome';
import LoadingSpinner from '../../../../Shared/LoadingSpinner';

const DashHome = () => {
    const {role, isLoading}=useRole()
    if (isLoading) return <LoadingSpinner />;

  if (role === 'admin') return <AdminHome />;
  if (role === 'agent') return <AgentHome />;
  return <CustomerHome />;
    
};

export default DashHome;