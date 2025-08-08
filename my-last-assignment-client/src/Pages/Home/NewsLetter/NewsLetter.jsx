import React from 'react';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import newsletter from '../../../assets/clients/newsletter.webp'


const NewsLetter = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    try {
      await axiosSecure.post('/subscribe', {
        ...data,
        subscribedAt: new Date()
      });
      Swal.fire('Subscription successful!');
      reset();
    } catch (err) {
      console.error(err);
      toast.error('❌ Subscription failed');
    }
  };

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl bg-white md:max-w-full lg:max-w-screen-2xl md:px-24 lg:px-8 lg:py-20">
      
      <div className="flex flex-col max-w-screen-lg overflow-hidden bg-white rounded shadow-sm lg:flex-row sm:mx-auto">
        {/* Left Image */}
        <div className="relative lg:w-2/3 bg-white">
          <img
            src={newsletter}
            alt="Newsletter"
            className="object-cover mt-30 w-full lg:absolute lg:h-auto animate-float"
          />

          
         
        </div>

        {/* Right Form */}
        <div className="flex flex-col justify-center p-8 bg-white  lg:p-16 lg:pl-10 lg:w-1/2">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-gray-700 uppercase rounded-full bg-teal-accent-400">
              Subscribe Now
            </p>
            <h2 className="text-4xl font-bold text-primary mb-6">
              Stay Updated With Our<br /> Latest News
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register('name', { required: true })}
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              {...register('message')}
              placeholder="Write your message..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 cursor-pointer rounded-md hover:bg-pink-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
