import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import useAuth from '../../../../Hooks/useAuth';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const ApprovedCustomers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    console.log('approvedCustomers page agent', user)

    const { data: approvedCustomers = [], isLoading } = useQuery({
        queryKey: ['approvedCustomers', user?.email],
        queryFn: async () => {
            if (!user?.email) return []; 

            const res = await axiosSecure.get(`/applications/approved?agentEmail=${user?.email}`);
            return res.data || []; 
        },
        enabled: !!user?.email, 
    });

    console.log(approvedCustomers)

    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Approved Customers</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>#</th>
                            <th>Applicant Name</th>
                            <th>Status</th>
                            <th>Approved Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedCustomers.map((customer, index) => (
                            <tr key={customer._id}>
                                <td>{index + 1}</td>
                                <td>{customer.user?.name}</td>
                                <td>
                                    <span className="badge badge-success capitalize">{customer.status}</span>
                                </td>
                                <td>
                                    {customer.updatedAt
                                        ? format(new Date(customer.updatedAt), 'PPP')
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedCustomers;
