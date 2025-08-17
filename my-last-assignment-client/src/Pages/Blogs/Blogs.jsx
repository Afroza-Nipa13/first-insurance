import React from 'react';
import Container from '../../Shared/Container';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router';
import BlogCard from './BlogCard';
import { Helmet } from 'react-helmet-async';

const Blogs = () => {
    const axiosSecure = useAxiosSecure();
    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const res = await axiosSecure.get('/blogs')
            return res.data;
        }
    })
    { isLoading && <LoadingSpinner></LoadingSpinner> }

    return (
        <div className='pt-20 min-h-screen'>
            <Helmet>
                <title>Blogs | FIRST Life Insurance</title>
            </Helmet>
            <Container>
                <div className='py-10  mx-auto mb-8'>
                    <h2 className='text-gray-600 text-5xl font-bold mt-10 mb-20 uppercase divider'>All <span className='text-primary'>Insurance </span>Blogs</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {blogs.map((blog) => (
                            <BlogCard blog={blog}
                                key={blog._id}></BlogCard>
                        ))}
                    </div>
                </div>

            </Container>

        </div>
    );
};

export default Blogs;