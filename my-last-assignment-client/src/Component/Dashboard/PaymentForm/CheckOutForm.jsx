import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const CheckOutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate()
  const application = location.state;
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false);




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Step 1: Create payment intent
      const res = await axiosSecure.post('/payment-intent', {
        amount: application.premium.amount,
      });
      const clientSecret = res.data.clientSecret;

      // Step 2: Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });
      console.log("result 40line", result)

      if (result.error) {
        console.log("from line 42", result.error)

      } else if (result.paymentIntent.status === 'succeeded') {
        // Step 4: Update application status
        await axiosSecure.patch(`/applications/${application._id}/mark-paid`);

        // Step 5: Save successful payment
        const paymentData = {
          transactionId: result.paymentIntent.id,
          email: application.user.email,
          policyTitle: application.policy?.title || 'N/A',
          amount: application.premium.amount,
          status: 'success',
          date: new Date(),
        };

        await axiosSecure.post('/payments', paymentData);
        toast.success('💳 Payment Successful!');
        navigate('/dashboard/my-policies');
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      // Step 3: Save failed payment attempt
      const failedPaymentData = {
        transactionId: 'N/A',
        email: application.user.email,
        policyTitle: application.policy?.title || 'N/A',
        amount: application.premium.amount,
        status: 'failed',
        errorMessage: error.message,
        date: new Date(),
      };

      await axiosSecure.post('/payments', failedPaymentData);
      toast.error(error.message);
      setError(error.message);
      
      
    } finally {
      setProcessing(false);
    }
  };


  return (
    <div className='max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold text-center mb-6'>Pay ৳{application.premium.amount}</h2>
      <form onSubmit={handleSubmit}>
        <CardElement className='p-4 border rounded mb-4' />
        <button className='btn btn-primary w-full' type='submit' disabled={!stripe || processing}>
          {processing ? 'Processing...' : 'Pay Now'}
        </button>

        {
          error && <p className='text-red-700 my-3'>{error} </p>
        }
      </form>
    </div>
  );
};

export default CheckOutForm;