import React from 'react';
import useAuth from '../../../../Hooks/useAuth';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaExclamationCircle, FaFileAlt, FaHourglassHalf, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router';

const AgentHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure()

    // Pending Applications (new)
    const { data: pendingApps = [] } = useQuery({
        queryKey: ['pendingAgentApps', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/agent-applications?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });
    // assigned applications
    const { data: assignedApps = [] } = useQuery({
        queryKey: ['applications', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/approved?agentEmail=${user?.email}`);
            return res.data;
        }
    })

    // Fetch agent's blogs
    const { data: agentBlogs = [] } = useQuery({
        queryKey: ['agentBlogs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs?email=${user?.email}`);
            return res.data;
        }
    })


    // Fetch pending claims for this agent
    const { data: assignedCustomers = [] } = useQuery({
        queryKey: ['assignedCustomers'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications?email=${user.email}&status=pending`);
            return res.data;
        }
    });



    return (
        <div
            data-aos="fade-up"
            data-aos-duration="3000"
            className="p-4 bg-base-100">
            <h2 className="text-4xl text-primary font-bold mb-10">Welcome, <span className='text-primary'>{user?.displayName}</span>!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Pending Applications */}
                <div className="card bg-gradient-to-br from-yellow-50 to-yellow-200 text-yellow-800 shadow-xl p-6">
                    <div className="flex items-center gap-4">
                        <FaHourglassHalf className="text-4xl" />
                        <div>
                            <h3 className="text-lg">Pending Applications</h3>
                            <p className="text-2xl font-bold">{pendingApps.length}</p>
                        </div>
                    </div>
                </div>





                {/* Assigned Customers */}
                <div className="card bg-gradient-to-br from-blue-50 to-blue-200 text-blue-900 shadow-xl p-6">
                    <div className="flex items-center gap-4">
                        <FaUsers className="text-4xl" />
                        <div>
                            <h3 className="text-lg">Assigned Customers</h3>
                            <p className="text-2xl font-bold">{assignedApps.length}</p>
                        </div>
                    </div>
                </div>

                {/* Blogs Created */}
                <div className="card bg-gradient-to-br from-purple-50 to-purple-200 text-purple-900 shadow-xl p-6">
                    <div className="flex items-center gap-4">
                        <FaFileAlt className="text-4xl" />
                        <div>
                            <h3 className="text-lg">My Blogs</h3>
                            <p className="text-2xl font-bold">{agentBlogs.length}</p>
                        </div>
                    </div>
                </div>

                {/* Pending Claims */}
                <div className="card bg-gradient-to-br from-red-50 to-red-200 text-red-900 shadow-xl p-6">
                    <div className="flex items-center gap-4">
                        <FaExclamationCircle className="text-4xl" />
                        <div>
                            <h3 className="text-lg">Pending Claims</h3>
                            <p className="text-2xl font-bold">{assignedCustomers.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional: Quick Action Buttons */}
            <div className="my-10 flex flex-around text-center  space-x-4">
                <Link to='/dashboard/agent/manage-blogs'><button className="btn btn-primary text-gray-100">Manage Blogs</button></Link>
                <Link to='/dashboard/agent/assigned-customers'><button className="btn btn-secondary text-gray-100">Assigned Customers</button></Link>
                <Link to='/dashboard/agent/assigned-customers'><button className="btn btn-accent text-gray-100">Clearance Requests</button></Link>
            </div>
        </div>
    );
};

export default AgentHome;