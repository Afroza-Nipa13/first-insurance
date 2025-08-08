import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaMoneyBillWave } from 'react-icons/fa';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

const TotalIncomeCard = () => {
    const axiosSecure = useAxiosSecure();

    const {data: totalIncome=0,isLoading}=useQuery({
        queryKey:['totalIncome'],
        queryFn:async()=>{
            const res = await axiosSecure.get('/total-income')
            return res.data.totalIncome;
        }
    })
    return (
        <div className="bg-linear-65 from-blue-900 to-pink-500 p-10 rounded-xl shadow-md flex items-center gap-5">
      <FaMoneyBillWave className="text-7xl text-white" />
      <div>
        <p className="text-xl text-yellow-100 font-medium">Your Total Income</p>
        {isLoading ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <p className="text-6xl font-bold text-white uppercase">৳ {totalIncome}</p>
        )}
      </div>
    </div>
    );
};

export default TotalIncomeCard;