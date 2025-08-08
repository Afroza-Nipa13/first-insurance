import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import { FaStar } from 'react-icons/fa';
import Marquee from 'react-fast-marquee';
import { Helmet } from 'react-helmet-async';

const TestimonialsMarquee = () => {
  const axiosSecure = useAxiosSecure();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await axiosSecure.get('/reviews');
      return res.data;
    }
  });
  if (isLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <div className=" py-10 px-8 rounded my-20">
      <Helmet>
        <title>Home | FIRST Life Insurance</title>
      </Helmet>
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-5xl font-bold text-center  text-primary ">What   <span className='text-gray-600'>Our</span> Customers Says </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Our customers trust us to protect their future with reliable and affordable insurance plans. Their stories reflect our commitment to quality service, financial security, and peace of mind — because your satisfaction is our greatest achievement.
        </p>
      </div>
      <Marquee speed={20} pauseOnHover gradient={false}>
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-gray-50 cursor-pointer hover:bg-white shadow-lg rounded-lg pt-6 px-8 mx-4 min-w-[400px] max-w-xs h-[350px] flex flex-col justify-center">
            <div className="flex items-end mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 w-[30px]" />
              ))}
              {[...Array(5 - review.rating)].map((_, i) => (
                <FaStar key={i} className="text-gray-300" />
              ))}
            </div>
            <p className="text-gray-900 text-lg italic line-clamp-3">"{review.feedback}"</p>
            <p className="text-xl text-primary mt-5">– {review.userName}</p>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default TestimonialsMarquee;