import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import { FaCoins } from 'react-icons/fa';

const MyEarning = () => {
    const { user } = useAuth();
   
    const axiosSecure = useAxiosSecure();
    const { data: totalEarning = 0, isLoading } = useQuery({
  queryKey: ['totalEarning', user?.email],
  enabled: !!user?.email,
  queryFn: async () => {
    const res = await axiosSecure.get(`/admin-income`);
    return res.data.totalIncome; 
  }
});

  if(isLoading) return <LoadingSpinner></LoadingSpinner>  

    return (

        <div className="bg-gradient-to-r from-teal-900 to-emerald-100 p-10 rounded-xl shadow-md flex items-center gap-5">
            <FaCoins className="text-7xl text-white" />
            <div>
                <p className="text-xl text-white font-medium">Your Earnings</p>
                {isLoading ? (
                    <LoadingSpinner></LoadingSpinner>
                ) : (
                    <p className="text-6xl font-bold text-white uppercase">৳ {totalEarning}</p>
                )}
            </div>
        </div>
    );
};

export default MyEarning;