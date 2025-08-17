import React from 'react';
import { useQuery } from '@tanstack/react-query';


import { format } from 'date-fns';
import LoadingSpinner from '../../../../Shared/LoadingSpinner';
import useAuth from '../../../../Hooks/useAuth';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const CustomerHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: myApplications = [], isLoading } = useQuery({
    queryKey: ['myApplications', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });
  if (isLoading) return <LoadingSpinner></LoadingSpinner>

  const total = myApplications.length;
  const approved = myApplications.filter(app => app.status?.toLowerCase() === 'approved').length;
  const pending = myApplications.filter(app => app.status?.toLowerCase() === 'pending').length;
  const rejected = myApplications.filter(app => app.status?.toLowerCase() === 'rejected').length;
  const totalPaid = myApplications.filter(app => app.premium?.status === 'paid').length;
  const totalDue = myApplications.filter(app => app.premium?.status === 'due').length;
 
  console.log("my applications", myApplications)
  
 return (
    <div 
    data-aos="fade-up"
    data-aos-duration="3000"
    className="p-4 space-y-6">
      <h2 className="text-4xl text-primary font-bold">Welcome back, {user?.displayName || 'Customer'}!</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 text-gray-700 gap-4">
        <div className="bg-gray-200 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Total Applied</h4>
          <p className="text-2xl">{total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Approved</h4>
          <p className="text-2xl">{approved}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Pending</h4>
          <p className="text-2xl">{pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Rejected</h4>
          <p className="text-2xl">{rejected}</p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-gray-600">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Payments Paid</h4>
          <p className="text-2xl">{totalPaid}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Payments Due</h4>
          <p className="text-2xl">{totalDue}</p>
        </div>
      </div>

      {/* Recent 3 Applications */}
      <div>
        <h3 className="text-2xl font-bold mt-6 mb-2">Recent Applications</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Premium</th>
                <th>Rejected Feedback</th>
              </tr>
            </thead>
            <tbody>
              {myApplications.map(app => (
                <tr key={app._id}>
                  <td>{app.policy?.title || 'N/A'}</td>
                  <td>{app.status}</td>
                  <td>{format(new Date(app.createdAt), 'PPP')}</td>
                  <td>
                    {app.premium?.amount}৳ / {app.premium?.frequency}
                  </td>
                  <td>
                    {app.status === 'Rejected' && app.rejectionFeedback

                      ? app.rejectionFeedback

                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
