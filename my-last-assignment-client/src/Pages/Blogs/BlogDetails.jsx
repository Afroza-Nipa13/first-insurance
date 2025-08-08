import React from 'react';
import { FaArrowLeft, FaThumbsUp } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import defaultImg from '../../assets/placeholder.jpg'

const BlogDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()

    const { data: blog, isLoading } = useQuery({
        queryKey: ['blog', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs/${id}`);
            return res.data;
            
        }

        
    })
    console.log('Blog Image:', blog?.image)
   


    const handleHelpfulClick = () => {
        // You can enhance this by sending feedback or storing helpful count
        Swal.fire('✅ Thanks for your feedback!');
    };

    if (isLoading || !blog) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto mt-8 p-4">
            {/* Banner Section */}
            <div className="relative w-full max-h-[400px] overflow-hidden rounded-xl shadow-lg mb-6">
                <img
                    src={blog?.image || 'https://i.ibb.co/Y3fKn7F/default-banner.jpg'}
                   
                    alt={blog?.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-30 flex items-end p-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-xl">
                        {blog?.title}
                    </h1>
                </div>
            </div>

            {/* Author & Metadata */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img
                        src={blog?.authorImage || defaultImg}
                        alt={blog?.author}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-lg font-semibold text-primary">{blog?.author}</p>
                        {blog?.publishDate && (
                            <p className="text-sm text-gray-500">
                                Published on {format(new Date(blog.publishDate), 'PPP')}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <span className="badge badge-info text-white">Total Visits: {blog?.visitCount || 0}</span>
                </div>
            </div>

            {/* Content */}
            <div className="prose lg:prose-xl max-w-full">
                <p>{blog?.content}</p>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex justify-between">
                <button
                    className="btn btn-outline btn-secondary flex items-center gap-2"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Go Back
                </button>

                <button
                    className="btn btn-primary flex items-center gap-2"
                    onClick={handleHelpfulClick}
                >
                    <FaThumbsUp /> Is it helpful for you?
                </button>
            </div>
        </div>
    );
};

export default BlogDetails;