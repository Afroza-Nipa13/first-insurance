import React from 'react';
import {
  FaShippingFast,
  FaMapMarkedAlt,
  FaBoxes,
  FaHandHoldingUsd,
  FaWarehouse,
  FaUndoAlt
} from 'react-icons/fa';
import ServiceCard from './ServiceCard';

import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import Error from '../../../Shared/Error';

const OurServices = () => {
  
  const axiosSecure=useAxiosSecure()

  const {data : popularPolices=[], isLoading, isError}=useQuery({
    queryKey:['popularPolices'],
    queryFn:async()=>{
      const res = await axiosSecure.get('/popular-policies?limit=6')
      return res.data;
    }
  })



  const animations = ['fade-up', 'fade-down', 'zoom-in', 'flip-left', 'flip-right'];
  {isLoading && <LoadingSpinner></LoadingSpinner>}
  {isError && <Error></Error>}
  return (
    <section className="py-16 px-4 md:px-10 bg-linear-to-bl from-pink-900 to-teal-950 rounded-3xl my-30">
      <div className="max-w-11/12 mx-auto text-center mb-10">
        <h2 className="text-5xl mb-8 font-bold text-center text-shadow-lg text-yellow-200 ">Popular  <span className='text-gray-400'>Policies</span> </h2>
        <p className="text-gray-200 max-w-2xl mx-auto">
          Discover our most purchased insurance policies tailored for your needs. Select your plan and get a personalized quote today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 h-full">
        {popularPolices.map((policy, index) => {
          const animation = animations[index % animations.length];
          const delay = index * 100;

          return (
            <div
              key={index}
              data-aos={animation}
              data-aos-delay={delay}
              data-aos-duration="800"
              className='h-full'
            >
              <ServiceCard policy={policy} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OurServices;