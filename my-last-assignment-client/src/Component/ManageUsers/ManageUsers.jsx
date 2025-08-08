import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filterRole, setFilterRole] = useState('');

    // Loading all or filtered users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users', filterRole],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users${filterRole ? `?role=${filterRole}` : ''}`);
            return res.data;
        }
    });

    //   promote customer as agent
    const promoteMutation = useMutation({
        mutationFn: async (id) => await axiosSecure.patch(`/users/${id}/promote`),
        onSuccess: () => {
            Swal.fire('Success', 'Promoted to Agent', 'success');
            queryClient.invalidateQueries(['users']);
        }
    });

    //   demote agent as agent

    const demoteMutation = useMutation({
        mutationFn: async (id) => await axiosSecure.patch(`/users/${id}/demote`),
        onSuccess: () => {
            Swal.fire('Success', 'Demoted to Customer', 'success');
            queryClient.invalidateQueries(['users'])
        }

    })

    const handleDeleteUser = async (id) => {
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
      const res = await axiosSecure.delete(`/users/${id}`);
      if (res.data?.deletedCount > 0) {
        Swal.fire('Deleted!', 'User has been removed.', 'success');
        queryClient.invalidateQueries(['users']); // Refresh table
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Failed to delete user.', 'error');
    }
  }
};



    { isLoading & <LoadingSpinner></LoadingSpinner> }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

            {/* 🔍 Filter */}
            <div className="mb-4">
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="select select-bordered w-full max-w-xs"
                >
                    <option value="">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* 📋 User Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-base">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u._id}>
                                <td>{idx + 1}</td>
                                <td>{u.displayName || 'N/A'}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className="badge badge-info text-white">{u.role}</span>
                                </td>
                                <td>{u.created_at ? format(new Date(u.created_at), 'PPP') : 'N/A'}</td>
                                <td className="space-x-2 flex">
                                    {u.role === 'customer' && (
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => promoteMutation.mutate(u._id)}
                                        >
                                            Promote to Agent
                                        </button>
                                    )}
                                    {u.role === 'agent' && (
                                        <button
                                            className="btn btn-xs btn-warning"
                                            onClick={() => demoteMutation.mutate(u._id)}
                                        >
                                            Demote to Customer
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteUser(u._id)}
                                        className="btn btn-xs btn-error"
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;