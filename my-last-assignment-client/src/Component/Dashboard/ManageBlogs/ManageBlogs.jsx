import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import { useSearchParams } from 'react-router';
import imageUpload from '../../../utils/imageUpload';
import { Helmet } from 'react-helmet-async';

const ManageBlogs = () => {
    const [searchParams] = useSearchParams()
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false)
    const [editingBlog, setEditingBlog] = useState(null)
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false); // optional
    console.log('manage blogs page', user)



    useEffect(() => {
        if (searchParams.get('add') === 'new') {
            setShowForm(true);
        }
    }, [searchParams]);


    const { data: blogs = [], isLoading, refetch } = useQuery({
        queryKey: ['myBlogs', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs?email=${user?.email}`)
            return res.data;

        }
    })


    const blogMutation = useMutation({
        mutationFn: async (formData) => {
            if (editingBlog) {
                // Edit
                const res = await axiosSecure.patch(`/blogs/${editingBlog._id}`, formData);
                return res.data;
            } else {
                // Add
                const res = await axiosSecure.post('/blogs', formData);
                return res.data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myBlogs']);
            toast.success(editingBlog ? 'Blog updated' : 'Blog added');
            setEditingBlog(null);
            setShowForm(false);
        },
        onError: () => {
            toast.error('Something went wrong');
        }
    });
    const handlePhotoUpload = async (e) => {
        const imageFile = e.target.files[0]
        if (!imageFile) return;
        setUploading(true)
        try {
            const uploadUrl = await imageUpload(imageFile)
            setImageUrl(uploadUrl)

        }
        catch (error) {
            console.log(error)
            toast.error('Image upload failed!');
        }
        finally {
            setUploading(false)
        }


    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = e.target;
        const title = form.title.value;
        const content = form.content.value;
        const publishDate = new Date()

        // console.log(form)
        if (!imageUrl) {
            return toast.error('Please upload an image first!');
        }

        const blogData = {
            image: imageUrl,
            title,
            content,
            author: user.displayName,
            email: user.email,
            publishDate,
            visitCount: 0,
        };
        blogMutation.mutate(blogData)
    }



    const handleDelete = (blogId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBlog(blogId); // ✅ call mutation to delete
            }
        });
    };

    const { mutate: deleteBlog } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/blogs/${id}`);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.deletedCount > 0) {
                Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
                refetch(); // refresh table
            }
        },
        onError: () => { Swal.fire('Failed!', 'Something went wrong.', 'error') }
    });


    return (
        <div className="p-6">
            <Helmet>
                <title>Manage Blogs | FIRST Life Insurance</title>
            </Helmet>
            <div className='flex flex-col justify-start'>
                <h2 className="text-4xl text-primary font-bold  mb-6 divider">Manage My Blogs</h2>
                <h2 className="text-4xl font-extrabold my-4 bg-base-200 p-3 rounded-2xl lg:w-[600px] text-primary uppercase">{user.displayName}</h2>
            </div>
            <small className='text-gray-500'>Author</small>

            <div className="text-right mb-6">
                <button className="btn btn-primary" onClick={() => {
                    setEditingBlog(null); // Add Mode
                    setShowForm(true);
                }}>
                    ➕ Add Blog
                </button>
            </div>

            {isLoading ? (
                <LoadingSpinner></LoadingSpinner>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full text-sm">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>image</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Author</th>
                                <th>Publish Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.length === 0 ? (
                                <tr>
                                    <td 
                                    data-aos="fade-up"
                                    colSpan="7" 
                                    className="text-center text-4xl my-10 py-10 text-gray-500 font-medium italic">
                                        📝 No blogs found. Add your first blog!
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog, index) => (
                                    <tr key={blog._id}>
                                        <td>{index + 1}</td>
                                        <td><img src={blog.image} alt="" className="w-20 h-14 object-cover rounded-md" /></td>
                                        <td>{blog.title}</td>
                                        <td>
                                            <div
                                                className="max-w-xs max-h-24 overflow-y-auto"
                                                dangerouslySetInnerHTML={{ __html: blog.content }}
                                            />
                                        </td>
                                        <td>{blog.author}</td>
                                        <td>{blog.publishDate}</td>
                                        <td className='flex gap-2'>
                                            <button
                                                className="btn btn-sm btn-info"
                                                onClick={() => {
                                                    setEditingBlog(blog);
                                                    setShowForm(true);
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => handleDelete(blog._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            )}

            {/* Blog Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-base-200 bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-gray-100 p-6 rounded-lg w-[500px] relative">
                        <h3 className="text-xl font-bold mb-4">
                            {editingBlog ? '✏️ Edit Blog' : '➕ Add New Blog'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">

                                <label htmlFor="photoUpload" className="bg-white text-gray-700 font-medium px-4 py-2 rounded-full shadow cursor-pointer inline-block mb-2">
                                    📷 Upload Blog Image
                                    <input
                                        type="file"
                                        id="photoUpload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />

                                </label>
                                {uploading && (
                                    <p className="text-sm text-gray-500 mb-2">Uploading image, please wait...</p>
                                )}
                                {imageUrl && !uploading && (
                                    <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-md mb-4" />
                                )}
                                {!imageUrl && editingBlog?.image && !uploading && (
                                    <img src={editingBlog.image} alt="Preview" className="w-full h-40 object-cover rounded-md mb-4" />
                                )}



                                <label className="block mb-1 font-medium">Title</label>
                                <input
                                    name="title"
                                    defaultValue={editingBlog?.title || ''}
                                    required
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 font-medium">Content</label>
                                <textarea
                                    name="content"
                                    defaultValue={editingBlog?.content || ''}
                                    required
                                    className="textarea textarea-bordered w-full"
                                    rows={4}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 font-medium">Publish Date</label>
                                <input
                                    type="date"
                                    name="publishDate"
                                    defaultValue={editingBlog?.publishDate || format(new Date(), 'yyyy-MM-dd')}
                                    required
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="submit" className="btn btn-success text-white">
                                    {editingBlog ? 'Update' : 'Add'}
                                </button>
                                <button className="btn btn-error text-white" type="button" onClick={() => {
                                    setShowForm(false);
                                    setEditingBlog(null);
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
};

export default ManageBlogs;