import React from 'react';
import { FaFileAlt, FaMoneyCheckAlt } from 'react-icons/fa';
import MenuItem from '../MenuItem';

const CustomerMenu = () => {
    return (
        <div>
            <MenuItem icon={FaFileAlt} label='My Policies' address='/dashboard/my-policies' />
            <MenuItem icon={FaMoneyCheckAlt} label='Payment Status' address='/dashboard/payment-status' />

            
         </div>
    );
};

export default CustomerMenu;