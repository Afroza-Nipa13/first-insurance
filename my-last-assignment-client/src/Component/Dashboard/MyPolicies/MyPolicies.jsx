import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

import { FaEye, FaStar } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const MyPolicies = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [review, setReview] = useState({ rating: 0, feedback: '' });
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimInfo, setClaimInfo] = useState(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['myPolicies', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications?email=${user?.email}`);
      return res.data;
    }
  });

  const handleOpenDetails = (policy) => {
    setSelectedPolicy(policy)
    setDetailsModalOpen(true)
    console.log(policy)

  }

  const handleOpenReview = (app) => {
    console.log(app)
    setSelectedPolicy(app)
    setReviewModalOpen(true)

  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    const reviewData = {
      policyId: selectedPolicy?.policy?._id,
      userName:user?.displayName,
      userEmail: user?.email,
      rating: review?.rating,
      feedback: review?.feedback,
      createdAt: new Date()
    }
    try {
      const res = await axiosSecure.post('/reviews', reviewData);
      if (res.data.insertedId) {
        setReviewModalOpen(false)
        toast.success('Your review saved successfully..Thanks for your feedback.')
      }

    } catch (err) {
      console.log(err)
      toast.error('Failed to submit review')
    }



  }


  const handleOpenClaim = (app) => {
    setClaimInfo(app);
    setClaimModalOpen(true);
  };


  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const reason = form.reason.value;
    const file = form.document.files[0];

    let documentURL = null;

    // Optional: Upload file to Firebase / Cloud and get URL
    try {
      // ✅ Step 1: Upload to imgbb (only if file is selected)
      if (file) {
        const apiKey = import.meta.env.VITE_ImgBB_Api_Key;
        const formData = new FormData();
        formData.append('image', file);

        const uploadData = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);


        if (uploadData.data.success) {
          documentURL = uploadData.data.data.url;
        } else {
          toast.error('❌ File upload failed');
          return;
        }
      }

      // ✅ Step 2: Prepare claim data
      const claimData = {
        policyId: claimInfo?.policy?._id,
        userEmail: user?.email,
        reason,
        document: documentURL || null,
        status: 'Pending',
        submittedAt: new Date()
      };

      // ✅ Step 3: Post to backend
      const res = await axiosSecure.post('/claims', claimData);
      if (res.data.insertedId) {
        toast.success('Your claim submitted successfully!');
        setClaimModalOpen(false);
      }

    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to submit claim');
    }
  };

  const { data: claims = [] } = useQuery({
    queryKey: ['myClaims', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/claims?email=${user?.email}`);
      return res.data;
    }
  });

  const hasClaimed = (policyId) => {
    return claims.some(claim => claim.policyId === policyId);
  };





  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="p-4">
      <Helmet>
        <title>My Policies | FIRST Life Insurance</title>
      </Helmet>
      <h2 className="text-3xl font-bold text-center mb-6">📄 My Policies</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base">
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.policy?.title || 'N/A'}</td>
                <td>
                  <span
                    className={`badge ${app.status === 'Approved'
                      ? 'badge-success text-white'
                      : app.status === 'Rejected'
                        ? 'badge-error text-white'
                        : app.status === 'Active'
                          ? 'badge-info text-white'
                          : 'badge-warning text-white'
                      }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleOpenDetails(app.policy)}
                    className="btn btn-sm btn-info"
                  >
                    <FaEye className="mr-1" /> Details
                  </button>
                  <button
                    onClick={() => handleOpenReview(app)}
                    className="btn btn-sm btn-warning"
                  >
                    <FaStar className="mr-1" /> Review
                  </button>


                  {app.status === 'Active' && (
                    <button
                      onClick={() => handleOpenClaim(app)}
                      className="btn btn-sm btn-success"
                      disabled={hasClaimed(app.policy?._id)}
                    >
                      📝 Claim
                    </button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Policy Details */}
      <Dialog open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-2">Policy Details</Dialog.Title>
            <p><strong>Title:</strong> {selectedPolicy?.title}</p>
            <p><strong>Coverage:</strong> ৳{selectedPolicy?.coverageRange?.min} - ৳{selectedPolicy?.coverageRange?.max}</p>
            <p><strong>Duration Options:</strong> {selectedPolicy?.durationOptions?.join(', ')} years</p>
            <p><strong>Base Premium Rate:</strong> {selectedPolicy?.basePremiumRate}</p>
            <div className="mt-4 text-right">
              <button onClick={() => setDetailsModalOpen(false)} className="btn btn-sm">Close</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal: Review */}
      <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">Submit Review</Dialog.Title>
            <form onSubmit={handleReviewSubmit} className="space-y-4">

              {/* Inside Modal Form */}
              <div>
                <label className="font-medium mb-1 block">Your Rating</label>
                <StarRating rating={review.rating} setRating={(val) => setReview({ ...review, rating: val })} />
              </div>

              <div>
                <label className="font-medium">Your Feedback</label>
                <textarea
                  value={review.feedback}
                  onChange={(e) => setReview({ ...review, feedback: e.target.value })}
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  placeholder="Write your experience..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>


      <Dialog open={claimModalOpen} onClose={() => setClaimModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">Submit Claim Request</Dialog.Title>
            <form onSubmit={handleClaimSubmit} className="space-y-4">

              <div>
                <label className="font-medium">Policy Name</label>
                <input
                  readOnly
                  value={claimInfo?.policy?.title}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="font-medium">Reason for Claim</label>
                <textarea
                  required
                  name="reason"
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  placeholder="Describe the reason..."
                ></textarea>
              </div>

              <div>
                <label className="font-medium">Upload Document (optional)</label>
                <input type="file" name="document" className="file-input file-input-bordered w-full" />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setClaimModalOpen(false)} className="btn btn-sm">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary">Submit Claim</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

    </div>
  );
};

export default MyPolicies;
