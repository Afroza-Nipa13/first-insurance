import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import useAuth from '../../../Hooks/useAuth';

const AssignedCustomers = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure();
    const [selectedApp, setSelectedApp] = useState(null)

    const { data: assignedCustomers = [], isLoading: appLoading, refetch } = useQuery({
        queryKey: ['assignedCustomers', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/agent-applications?email=${user?.email}`);
            return res.data;
        }
    });


    //     const { data: agentApplications = [] } = useQuery({
    //   queryKey: ['agentApplications', user?.email],
    //   queryFn: async () => {
    //     const res = await axiosSecure.get(`/agent-applications?email=${user?.email}`);
    //     return res.data;
    //   }
    // });




    const { mutate, isLoading } = useMutation({

        mutationFn: async ({ appId, policyId, status }) => {
            const res = await axiosSecure.patch(`/applications/${appId}`, {
                status,
                policyId
            })
            return res.data;
        },

        onSuccess: () => {
            toast.success('status updated successfully')

            refetch()
        },
        onError: () => {
            toast.error('Status update failed')
        }


    })
    { isLoading && <LoadingSpinner></LoadingSpinner> }
    { appLoading && <LoadingSpinner></LoadingSpinner> }


    return (
        <div className="p-4">
            <h2 className="text-5xl text-primary font-bold text-center mb-12 divider"> Pending Customers</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                    <thead className="bg-base-200 text-base">
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Interested Policies</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedCustomers.length === 0 ? (
                            <tr>
                                <td 
                                data-aos="fade-up"
                                colSpan="5" className="text-center text-4xl py-10 text-gray-500 font-bold">
                                    🎉 No pending customers found.
                                </td>
                            </tr>
                        ) : (
                            assignedCustomers.map((app, index) => (
                                <tr key={app._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <p className="font-semibold">{app.user?.name || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{app.user?.email}</p>
                                    </td>
                                    <td>{app.policy?.title || 'N/A'}</td>
                                    <td>
                                        <select
                                            disabled={isLoading}
                                            value={["Pending", "Approved", "Rejected"].includes(app.status) ? app.status : "Pending"}
                                            onChange={(e) =>
                                                mutate({
                                                    appId: app._id,
                                                    policyId: app.policy?._id,
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <FaEye className="mr-1" />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <h3 className="text-xl font-bold mb-4">Customer Details</h3>
                        <p><strong>Name:</strong> {selectedApp.user?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedApp.user?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {selectedApp.user?.phone || 'N/A'}</p>
                        <p><strong>Policy Interested:</strong> {selectedApp.policy?.title || 'N/A'}</p>
                        <p><strong>Inquiry:</strong> {selectedApp.inquiry || 'No inquiry info'}</p>
                        {/* Close button */}
                        <button
                            className="btn btn-sm btn-error mt-4"
                            onClick={() => setSelectedApp(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignedCustomers;