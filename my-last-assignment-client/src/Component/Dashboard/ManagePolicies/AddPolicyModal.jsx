import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

const AddPolicyModal = ({ onClose, refetch }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm()
    const [selectedImage, setSelectedImage] = useState(null)

    const uploadImage = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgBB_Api_Key}`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        return data?.data?.url;
    };

    const onSubmit = async (data) => {
        let imageUrl = data.image;
        if (selectedImage) {
            imageUrl = await uploadImage(selectedImage);


        }

        const formData = {
            ...data,
            imageUrl,
            minAge: parseInt(data.minAge),
            maxAge: parseInt(data.maxAge),
            basePremiumRate: parseFloat(data.basePremiumRate),
            coverageRange: {
                min: parseInt(data.coverageMin),
                max: parseInt(data.coverageMax)
            },
            durationOptions: [data.duration1, data.duration2, data.duration3],
            createdAt: new Date()
        }
        try {
            const res = await axiosSecure.post('/all-policies', formData)
            if (res.data.insertedId) {
                Swal.fire("✅ Success!", "Policy added successfully.", "success");
                reset();
                onClose(); // close modal
                refetch(); // refresh policy list
            }

        } catch (error) {
            console.log(error)
            Swal.fire("❌ Failed", "Could not add policy", "error");
        }

    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <Helmet>
                <title>Add Policies | FIRST Life Insurance</title>
            </Helmet>
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
                <h2 className="text-2xl font-bold mb-4">➕ Add New Policy</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register("title")} required className="input input-bordered w-full" placeholder="Policy Title" />
                    <input {...register("category")} required className="input input-bordered w-full" placeholder="Category" />
                    <textarea {...register("description")} required className="textarea textarea-bordered w-full" placeholder="Description" />

                    <div className="flex gap-4">
                        <input {...register("minAge")} type="number" required className="input input-bordered w-full" placeholder="Min Age" />
                        <input {...register("maxAge")} type="number" required className="input input-bordered w-full" placeholder="Max Age" />
                    </div>

                    <div className="flex gap-4">
                        <input {...register("coverageMin")} required type="number" className="input input-bordered w-full" placeholder="Coverage Min" />
                        <input {...register("coverageMax")} required type="number" className="input input-bordered w-full" placeholder="Coverage Max" />
                    </div>

                    <div className="flex gap-4">
                        <input {...register("duration1")} required className="input input-bordered w-full" placeholder="Duration 1" />
                        <input {...register("duration2")} required className="input input-bordered w-full" placeholder="Duration 2" />
                        <input {...register("duration2")} required className="input input-bordered w-full" placeholder="Duration 3" />
                    </div>

                    <input {...register("basePremiumRate")} required type="number" step="0.01" className="input input-bordered w-full" placeholder="Base Premium Rate" />

                    <input
                        type='file'
                        className="input input-bordered w-full"
                        placeholder="Image file"
                        required
                        onChange={(e) => setSelectedImage(e.target.files[0])} />

                    <div className="flex justify-end gap-4 pt-2">
                        <button onClick={onClose} type="button" className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Policy</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPolicyModal;