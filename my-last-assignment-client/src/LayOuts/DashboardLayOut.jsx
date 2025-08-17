import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../Component/Dashboard/Sidebar';
import Scrollbar from '../Shared/Scrollbar';

const DashboardLayOut = () => {
  return (
    <div className='relative min-h-screen md:flex bg-base-100'>
      {/* Left Side: Sidebar Component */}
      <div className="">
        <Sidebar />
      </div>
      {/* Right Side: Dashboard Dynamic Content */}
      <div className='flex-1  md:ml-80'>
        <div className='p-5 bg-base-100'>
          {/* Outlet for dynamic contents */}
          <Outlet />
        </div>
      </div>
      <Scrollbar></Scrollbar>
    </div>
  );
};

export default DashboardLayOut;