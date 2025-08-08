import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import Error from '../../../Shared/Error';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';

const LatestBlogs = () => {
  const axiosSecure = useAxiosSecure();

  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await axiosSecure.get('/latest-blogs');
      return res.data;
    }
  })

  { isLoading && <LoadingSpinner></LoadingSpinner> }
  { isError && <Error></Error> }
  return (
    <div>
      <section className="py-16 px-4 md:px-10">
        <Helmet>
          <title>Home | FIRST Life Insurance</title>
        </Helmet>
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 text-primary">Latest Blogs <span className='text-gray-500'>&</span> Articles</h2>
          <p className="text-gray-600">Stay informed with our latest updates and expert tips.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-screen mx-auto">
          {blogs.map((blog) => (
            <div
            data-aos="fade-up"
            data-aos-duration="3000"
              key={blog._id}
              className="bg-radial-[at_25%_25%] from-blue-100 to-pink-100 to-75% shadow-xl rounded-lg overflow-hidden p-4 flex flex-col justify-between"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-40 w-full  object-cover mb-5 rounded"
                />
              )}
              <h3 className="text-lg font-semibold text-primary mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-900 line-clamp-4 mb-4">{blog.content.slice(0, 100)}...</p>

              <Link
                to={`/blogs/${blog._id}`}
                className="text-primary text-medium font-semibold hover:underline"
              >
                🔍 Read More
              </Link>
            </div>
          ))}
        </div>

        {/* All Blogs Button */}
        <div className="text-center mt-20">
          <Link
            to="/blogs"
            className="btn btn-outline text-xl py-2 btn-primary px-6"
          >
            View All Blogs
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LatestBlogs;