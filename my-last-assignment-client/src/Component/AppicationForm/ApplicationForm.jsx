import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const ApplicationForm = () => {
  const { id: policyId } = useParams();
  const location = useLocation();
  const quoteData = location.state;
  console.log(quoteData)
  const navigate=useNavigate()

  //   console.log('policy id from application form',policyId)
  // policy ID from URL
  const { user } = useAuth(); // Firebase user
  const axiosSecure = useAxiosSecure();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const healthDisclosure=["Diabetes", "High Blood Pressure", "Cancer", "Smoker", "Heart Disease", "Other"];
  
  
  const onSubmit = async (data) => {
    const application = {
      user: {
        name: user?.displayName,
        email: user?.email,
        address: data.address,
        nid: data.nid,
      },
      nominee: {
        name: data.nomineeName,
        relationship: data.relationship,
      },
      health: data.health || [],
      policyId,
      status: 'Pending',
      createdAt: new Date(),
      premium: quoteData?.premium || {
      amount: 0,
      frequency: 'monthly',
      status: 'due'
    }
    };
    console.log(application)

    try {
      const res = await axiosSecure.post('/applications', application);
      if (res.data.insertedId) {
        toast.success('Application submitted successfully!');
        reset();
        navigate('/dashboard/payment-status')
      } else {
        toast.error('Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  return (
    <div className="max-w-3xl space-y-8 mx-auto mb-10 mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-bold my-10 text-center divider text-primary">Apply for Policy</h2>
      <p>Selected Frequency: {quoteData?.frequency}</p>
      <p>Premium Amount: ৳{quoteData?.premium?.amount}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

        {/* 1️⃣ Personal Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2"> Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={user?.displayName} readOnly placeholder="Full Name" className="input input-bordered w-full" />
            <input value={user?.email} readOnly className="input input-bordered w-full bg-gray-100" />
            <input {...register('nid', { required: true })} type='number' placeholder="NID / SSN Number" className="input input-bordered w-full" />
            <textarea {...register('address', { required: true })} placeholder="Full Address" className="textarea textarea-bordered w-full" />
          </div>
        </div>

        {/* 2️⃣ Nominee Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2"> Nominee Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('nomineeName', { required: true })} placeholder="Nominee Name" className="input input-bordered w-full" />
            <input {...register('relationship', { required: true })} placeholder="Relationship (e.g., Brother)" className="input input-bordered w-full" />
          </div>
        </div>

        {/* 3️⃣ Health Disclosure */}
        <div>
          <h3 className="text-lg font-semibold mb-2">🩺 Health Disclosure</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {healthDisclosure.map((condition) => (
              <label key={condition} className="flex items-center gap-2">
                <input type="checkbox" value={condition} {...register('health')} className="checkbox checkbox-sm" />
                <span>{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ✅ Submit */}
        <button type="submit" className="btn btn-primary w-full">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
