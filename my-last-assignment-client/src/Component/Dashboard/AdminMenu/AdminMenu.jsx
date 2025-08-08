import { FaClipboardList, FaNewspaper, FaShieldAlt, FaUserCog } from 'react-icons/fa'

import { BsGraphUp } from 'react-icons/bs'
import MenuItem from '../MenuItem'
const AdminMenu = () => {
    return (
        <>
            
            {/* <MenuItem
                icon={FaMoneyCheckAlt}
                label="Manage Transaction"
                address="/dashboard/admin/manage-transaction"
            /> */}
            <MenuItem
                icon={FaUserCog}
                label='Manage Users'
                address='/dashboard/admin/manage-users' />
            <MenuItem
                icon={FaNewspaper}
                label='Manage Blogs'
                address='/dashboard/agent/manage-blogs'
            />
            <MenuItem
                icon={FaClipboardList}
                label="Manage Applications"
                address="/dashboard/admin/all-applications"
            />
            <MenuItem
                icon={FaShieldAlt}
                label="Manage Policies"
                address="/dashboard/admin/manage-policies"
            />


        </>
    )
}

export default AdminMenu