import React from 'react';
import ManageTransaction from '../../../../Component/Dashboard/ManageTransaction/ManageTransaction';

const AdminHome = () => {
    return (
        <div 
        data-aos="fade-up"
        className="p-4">
      <h2 className="text-5xl text-primary font-bold mb-4">Welcome, Admin!</h2>
      <ManageTransaction></ManageTransaction>
    </div>
    );
};

export default AdminHome;