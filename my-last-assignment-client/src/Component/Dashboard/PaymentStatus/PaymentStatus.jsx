import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { FaMoneyCheck } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const PaymentStatus = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();


    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['applications', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications?email=${user?.email}`);
            return res.data;
        }
    });
    const allApplications = applications;

    //   const dueApplications = applications.filter(app => app?.premium?.status === 'due');
    return (
        <div className="overflow-x-auto p-6">
            <Helmet>
                <title>Payment Status | FIRST Life Insurance</title>
            </Helmet>
            <h2 className="text-3xl font-bold mb-6 text-center">💳 Payment Status</h2>

            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <table className="table table-zebra w-full text-center">
                    <thead className="bg-base-200">
                        <tr>
                            <th>Policy</th>
                            <th>Premium Amount</th>
                            <th>Frequency</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allApplications.map(app => (
                            <tr key={app._id}>
                                <td>{app?.policy?.title}</td>
                                <td>৳{app?.premium?.amount}</td>
                                <td>{app?.premium?.frequency}</td>
                                <td>
                                    <span className={`badge ${app?.premium?.status === 'due' ? 'badge-error' : 'badge-success text-white'}`}>
                                        {app?.premium?.status}
                                    </span>
                                </td>
                                <td>
                                    {app?.premium?.status === 'due' ? (
                                        <Link
                                            to={`/dashboard/payment-form/${app._id}`}
                                            state={app}
                                        >
                                            <button className="btn btn-sm btn-primary">
                                                <FaMoneyCheck className="mr-2" /> Pay Now
                                            </button>
                                        </Link>
                                    ) : (
                                        <span className="text-green-600 font-semibold">✔ Paid</span>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {allApplications.length === 0 && (
                            <tr>
                                <td colSpan="5" className='text-4xl font-bold italic text-gray-500 my-10'>No pending payments found!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentStatus;