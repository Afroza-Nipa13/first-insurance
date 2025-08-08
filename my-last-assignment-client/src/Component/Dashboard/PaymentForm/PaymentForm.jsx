import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import CheckOutForm from './CheckOutForm';



const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const PaymentForm = () => {
    
    return (
        <Elements stripe={stripePromise}>
          <CheckOutForm></CheckOutForm>  
        </Elements>
    );
};

export default PaymentForm;