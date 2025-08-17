import { format } from 'date-fns';
import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import TotalIncomeCard from './TotalIncomeCard';
import FilterDropdown from './FilterDrowpdown';
import EarningRechart from './EarningRechart';
import { Helmet } from 'react-helmet-async';
import MyEarning from './MyEarning';

const ManageTransaction = () => {
    const axiosSecure = useAxiosSecure();
    const [filters, setFilters] = useState({});

    const handleFilterChange = (data) => {
        setFilters(data);
    };

    //     const { data: transactions = [], isLoading } = useQuery({
    //     queryKey: ['transactions'],
    //     queryFn: async () => {
    //       const res = await axiosSecure.get('/payments');
    //       return res.data;
    //     }
    //   });

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments', {
                params: filters
            });
            return res.data;
        },
    });

    if (isLoading) return <LoadingSpinner />;
    return (
        <div className="">
            <Helmet>
                <title>Manage Transaction | FIRST Life Insurance</title>
            </Helmet>
            <div className='grid gap-6 md:grid-cols-2'>
                
                <MyEarning></MyEarning>

                <EarningRechart payments={transactions}></EarningRechart>
            </div>

            <h2 className="text-3xl text-center font-bold my-10">💳Transactions</h2>

            <div>
                <FilterDropdown onFilter={handleFilterChange} ></FilterDropdown>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                    <thead className="bg-base-200 text-base">
                        <tr>
                            <th>#</th>
                            <th>Transaction ID</th>
                            <th>User Email</th>
                            <th>Policy</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={tx._id}>
                                <td>{index + 1}</td>
                                <td>{tx.transactionId}</td>
                                <td>{tx.email}</td>
                                <td>{tx.policyTitle}</td>
                                <td>৳{tx.amount}</td>
                                <td>{format(new Date(tx.date), 'PPP')}</td>
                                <td>
                                    <span
                                        className={`badge text-white ${tx.status === 'success' ? 'badge-success' : 'badge-warning'
                                            }`}
                                    >
                                        {tx.status}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageTransaction;