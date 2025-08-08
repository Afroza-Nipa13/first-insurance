import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router';
import AddPolicyModal from './AddPolicyModal';
import { Helmet } from 'react-helmet-async';

const ManagePolicies = () => {
    const axiosSecure = useAxiosSecure();
    const [showModal, setShowModal] = useState(false);
    const { data: policiesData = {}, isLoading, refetch } = useQuery({

        queryKey: ['policies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-policies');
            return res.data;

        }
    })
    const policies = policiesData.policies || [];

    const handleDeletePolicy = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/all-policies/${id}`);
                if (res.data?.deletedCount > 0) {
                    Swal.fire('Deleted!', 'Your selected policy has been removed.', 'success');
                    refetch()
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'Failed to delete policy.', 'error');
            }
        }
    };

    // if (!Array.isArray(policies)) {
    //   console.error("❌ policies is not an array:", policies);
    // }

    { isLoading & <LoadingSpinner></LoadingSpinner> }
    return (
        <div className="p-4">
            <Helmet>
                <title>Manage Policies | FIRST Life Insurance</title>
            </Helmet>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">📄 Manage Policies</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary">➕ Add New Policy</button>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full table-zebra">
                    <thead className="bg-base-200 text-base">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Age Range</th>
                            <th>Coverage</th>
                            <th>Duration</th>
                            <th>Rate</th>
                            <th>Popularity</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy, idx) => (
                            <tr key={policy._id}>
                                <td>{idx + 1}</td>
                                <td>
                                    <img src={policy.imageUrl} alt={policy.title} className="w-14 h-12 object-cover rounded" />
                                </td>
                                <td>{policy.title}</td>
                                <td>{policy.category}</td>
                                <td>{policy.minAge} - {policy.maxAge}</td>
                                <td>{policy.coverageRange?.min || 0} - ${policy.coverageRange?.max || 0}</td>
                                <td>
                                    {policy.durationOptions?.join(', ')}
                                </td>
                                <td>{policy.basePremiumRate}%</td>
                                <td>{policy.popularity || 0}</td>
                                <td>{format(new Date(policy.createdAt), 'PPP')}</td>
                                <td className="space-x-2 flex">
                                    <NavLink to={`/dashboard/admin/edit-policy/${policy._id}`}>
                                        <button
                                            className="btn btn-xs btn-info"
                                            title="Edit the policy">

                                            <FaEdit />
                                        </button>
                                    </NavLink>

                                    <button
                                        onClick={() => handleDeletePolicy(policy._id)}
                                        className="btn btn-xs btn-error"
                                        title="Delete policy">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <AddPolicyModal onClose={() => setShowModal(false)} refetch={refetch} />
            )}
        </div>
    );
};

export default ManagePolicies;