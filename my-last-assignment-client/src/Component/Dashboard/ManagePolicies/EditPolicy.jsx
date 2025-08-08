import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const EditPolicy = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();
     const [selectedImage, setSelectedImage] = useState(null);

      // Fetch existing policy
  const { data: policy = {}, isLoading } = useQuery({
    queryKey: ['singlePolicy', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-policies/${id}`);
      return res.data;
    },
    onSuccess: (data) => reset(data) // autofill
  });



  // 2. Upload image to imgbb
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


//   const { mutateAsync, isPending } = useMutation({
//     mutationFn: async (formData) => {
//       const res = await axiosSecure.patch(`/policies/${id}`, formData);
//       return res.data;
//     },
//     onSuccess: () => {
//       toast.success("✅ Policy updated successfully");
//     },
//     onError: () => toast.error("❌ Failed to update policy"),
//   });
const { mutateAsync, isPending}= useMutation({
    mutationFn:async(formData)=>{
        const res = await axiosSecure.patch(`/all-policies/${id}`, formData);
        return res.data;
    },
    onSuccess:()=>{
        Swal.fire('Policy updated successfully','success')
    },
    onError: ()=>{
        Swal.fire("Failed to update policy", 'error')
    }
})

  const onSubmit=async(data)=>{
    let imageUrl = policy.image;
    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
    
    }

    const updatedPolicy = {
        ...data,
        image: imageUrl,
      minAge: parseInt(data.minAge),
      maxAge: parseInt(data.maxAge),
      coverageRange: {
        min: parseInt(data.coverageRange?.min),
        max: parseInt(data.coverageRange?.max)},
        basePremiumRate: parseFloat(data.basePremiumRate),
      durationOptions: [data["durationOptions.0"], data["durationOptions.1"]]
}
    await mutateAsync(updatedPolicy)

  }


  {isLoading && <LoadingSpinner></LoadingSpinner>}
    return (
        <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Edit Policy</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label>Title</label>
        <input {...register("title")} className="input input-bordered w-full"  defaultValue={policy.title} />
        <label>Category</label>
        <input {...register("category")} className="input input-bordered w-full" defaultValue={policy.category} />
        <label>Description</label>
        <textarea {...register("description")} className="textarea textarea-bordered w-full" defaultValue={policy.description} />
        <label>Min age to Max age</label>
        <div className="flex gap-4">
          <input {...register("minAge")} type="number" className="input input-bordered w-full" defaultValue={policy.minAge} />
          <input {...register("maxAge")} type="number" className="input input-bordered w-full" defaultValue={policy.maxAge} />
        </div>
        <label>Coverage Range </label>
        <div className="flex gap-4">
          <input {...register("coverageRange.min")} type="number" className="input input-bordered w-full" defaultValue={policy.coverageRange?.min} />
          <input {...register("coverageRange.max")} type="number" className="input input-bordered w-full" defaultValue={policy.coverageRange?.max} />
        </div>
        <label>Duration Options</label>
        <input {...register("durationOptions.0")} className="input input-bordered w-full" defaultValue={policy.durationOptions?.[0]} />
        <input {...register("durationOptions.1")} className="input input-bordered w-full" defaultValue={policy.durationOptions?.[1]} />

        <input {...register("basePremiumRate")} type="number" step="0.01" className="input input-bordered w-full" defaultValue={policy.basePremiumRate} />

        {/* File input + preview */}
        
        <div>
          <p className="font-medium mb-1">Current Image:</p>
          <img src={policy.image} alt="Current" className="w-32 h-20 object-cover rounded mb-2" />

          <input type="file" 
          accept="image/*" 
          onChange={(e) => setSelectedImage(e.target.files[0])} 
          className="file-input file-input-bordered w-full"
          defaultValue={policy.image} />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
          {isPending ? "Updating..." : "Update Policy"}
        </button>
      </form>
    </div>
    );
};

export default EditPolicy;