import React from 'react';
import { FaNewspaper, FaPlus, FaUserCheck, FaUsers } from 'react-icons/fa';
import MenuItem from '../MenuItem';

const AgentMenu = () => {
  return (
    <div>
      <MenuItem
        icon={FaUsers}
        label='Pending Customers'
        address='/dashboard/agent/assigned-customers'
      />
      <MenuItem
        icon={FaUserCheck}
        label='Approved Customers'
        address='/dashboard/agent/approved-customers'
      />
      <MenuItem
        icon={FaNewspaper}
        label='Manage Blogs'
        address='/dashboard/agent/manage-blogs'
      />
      <MenuItem
        icon={FaPlus}
        label='Add Blog'
        address='/dashboard/agent/manage-blogs?add=new'
      />
    </div>
  );
};

export default AgentMenu;