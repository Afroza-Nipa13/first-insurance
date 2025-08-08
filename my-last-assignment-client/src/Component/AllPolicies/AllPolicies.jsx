import React, { useState } from 'react';
import { Link } from 'react-router';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

const AllPolicies = () => {
  const axios = useAxios();
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1)
  const limit = 6;


  // Fetch distinct categories dynamically from backend
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/policy-categories');
      return res.data;
    }
  });


  // Fetch policies with pagination
  const { data, isLoading: policiesLoading, isError } = useQuery({
    queryKey: ['allPolicies', category, page],
    queryFn: async () => {
      const res = await axios.get('/all-policies', {
        params: {
          category: category || undefined,
          page,
          limit
        }
      });
      return res.data;
    }
  });

  if (categoriesLoading || policiesLoading) return <LoadingSpinner />;
  if (isError) return <p className="text-center text-red-500">Failed to load policies.</p>;

  const { policies, totalCount } = data;
  const totalPages = Math.ceil(totalCount / limit);






  return (



    <div className="container text-center mx-auto px-4 pt-40 space-y-8 mb-20">
      <Helmet>
        <title>All Policies | FIRST Life Insurance</title>
        <meta name="description" content="Welcome to FIRST Life Insurance - Your trusted partner in securing your future." />
      </Helmet>
      <h2 className="text-5xl font-bold text-center  text-primary ">All  <span className='text-gray-500'>Insurance</span> Policies</h2>
      <small className='font-semibold text-gray-500 text-center mb-10 w-[100px] mx-auto'>Explore our wide range of life insurance policies. Choose the one that fits your needs best, and get a personalized quote to secure your future with confidence.</small>

      {/* Category Filter Dropdown */}
      <div className="my-6 flex justify-center">
        <select
          className="select select-bordered w-48 lg:w-3xl mb-20"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value=""
            className='py-6'>All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {policies.map(policy => (
          <div key={policy._id} className="card bg-base-100 shadow-xl border border-gray-200">
            <figure>
              <img src={policy.imageUrl} alt={policy.title} className="w-full h-48 object-cover" />
            </figure>
            <div className="card-body hover:bg-">
              <h2 className="card-title text-start text-blue-800">{policy.title}</h2>
              <p className="text-sm text-start text-gray-500">Category: <span className="font-medium text-gray-700">{policy.category}</span></p>
              <p className="text-gray-600 text-start mt-2">
                {policy.description.length > 100
                  ? policy.description.slice(0, 100) + '...'
                  : policy.description}
              </p>
              <div className="card-actions justify-start mt-4">
                <Link to={`/all-policies/${policy._id}`}>
                  <button className="btn btn-primary btn-sm">View Details</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Pagination */}
      <div className="flex justify-center mt-12 gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`btn btn-sm ${page === index + 1 ? 'btn-primary' : 'btn-outline'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllPolicies;
