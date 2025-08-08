import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';
import { useQuery } from '@tanstack/react-query';



const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  // console.log('user from useRole',user)

  const { data: role, isLoading: roleLoading, refetch } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      // console.log('Fetching role for:', user?.email)
      const res = await axiosSecure.get(`/users/role/${user?.email}`);
      // console.log('role response:', res.data);
      return res.data.role;
    },
  });

  return { role, roleLoading, refetch };
};

export default useRole;