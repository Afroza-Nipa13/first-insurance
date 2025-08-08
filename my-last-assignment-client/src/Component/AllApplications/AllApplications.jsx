import React, { useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { format } from 'date-fns';
import { FaDownload, FaEye, FaTimesCircle, FaUserCheck } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import ApplicationPDF from './ApplicationPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

const AllApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedApp, setSelectedApp] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [selectedFeedbackApp, setSelectedFeedbackApp] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  console.log(selectedAgent)


  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ['allApplications'],
    queryFn: async () => {
      const res = await axiosSecure.get('/applications');
      return res.data;
    }
  });

  const handleAssignAgent = async (application) => {
    setSelectedApp(application);
    try {
      const res = await axiosSecure.get('/users?role=agent');
      setAgents(res.data); // set dropdown list
    } catch (error) {
      console.error('Failed to fetch agents', error);
    }
  };


  if (isLoading) return <LoadingSpinner></LoadingSpinner>



  const handleReject = async (applicationId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reject this application?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/applications/${applicationId}/reject`);
          if (res.data.success) {
            Swal.fire('Rejected!', 'The application has been rejected.', 'success');
            refetch(); // optional
          }
        } catch (error) {
          console.log(error)
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };




  return (
    <div className="p-4 overflow-x-auto">
      <Helmet>
        <title>All Applications | FIRST Life Insurance</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-4">📋 Manage Applications</h2>

      <table className="table w-full">
        <thead>
          <tr className="bg-base-200 text-base">
            <th>#</th>
            <th>Applicant</th>
            <th>Email</th>
            <th>Policy</th>
            <th>Applied On</th>
            <th>Status</th>
            <th>Agent Email</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={app._id}>
              <td>{index + 1}</td>
              <td>{app.user?.name}</td>
              <td>{app.user?.email}</td>
              <td>{app.policy?.title || 'N/A'}</td>
              <td>{format(new Date(app.createdAt), 'PPP')}</td>
              <td>
                {app.status === 'Rejected' && app.feedback ? (
                  <span className="badge badge-error text-white">
                    Rejected: {app.feedback}
                  </span>
                ) : (
                  <span className={`badge ${app.status === 'Approved' ? 'badge-success text-white' :
                    app.status === 'Rejected' ? 'badge-error text-white' :
                      app?.status === 'Active' ? 'badge-info text-white' :
                        'badge-warning text-white'
                    }`}>
                    {app?.status}
                  </span>
                )}
              </td>
              <td>
                {app.status === 'Assigned' ? (
                  app.agentEmail || 'Unnamed Agent'
                ) : (
                  '—'
                )}
              </td>


              <td> <span className={`badge ${app.premium?.status === 'due' ? 'badge-error' : 'badge-success'} font-bold text-white`}>{app?.premium?.status}</span></td>
              <td className="space-x-2 flex">
                <button
                  onClick={() => handleAssignAgent(app)}
                  className="btn btn-sm btn-outline btn-success"
                  title={
                    app?.status === 'Approved'
                      ? 'Already Approved'
                      : app?.status === 'Assigned'
                        ? 'Already Assigned'
                        : app?.premium?.status === 'due'
                          ? 'Payment Due'
                          : 'Assign Agent'
                  }
                  disabled={
                    app?.premium?.status === 'due' ||
                    app?.status === 'Approved' ||
                    app?.status === 'Assigned'
                  }
                >
                  <FaUserCheck className="mr-1" />
                </button>

                <button
                  onClick={() => handleReject(app._id)}
                  className="btn btn-sm btn-outline btn-error"
                  title="Reject"
                >
                  <FaTimesCircle className="mr-1" />
                </button>

                <button
                  onClick={() => setSelectedAppDetails(app)}
                  className="btn btn-sm btn-outline btn-info"
                  title="View Details"
                >
                  <FaEye />
                </button>


                {app.status === 'Approved' && (
                  <PDFDownloadLink
                    document={<ApplicationPDF app={app} />}
                    fileName={`Application-${app._id}.pdf`}
                  >
                    {({ loading }) =>
                      loading ? (
                        <button className="btn btn-sm btn-outline btn-info" disabled>Loading...</button>
                      ) : (
                        <button className="btn btn-sm btn-outline btn-info" title="Download PDF">
                          <FaDownload className="mr-1" /> PDF
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                )}

                {app.status === 'Rejected' && (
                  <button
                    onClick={() => setSelectedFeedbackApp(app)}
                    className="btn btn-sm btn-outline btn-warning"
                    title="Give Feedback"
                  >
                    <FaTimesCircle className="mr-1" /> Feedback
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h3 className="text-lg font-bold">Assign Agent</h3>

            <select
              className="select select-bordered w-full"
              onChange={(e) => setSelectedAgent(JSON.parse(e.target.value))}
            >
              <option value="" disabled>Select an agent</option>
              {agents.map((agent) => (
                <option key={agent._id} value={JSON.stringify(agent)}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>


            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="btn btn-sm btn-error"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await axiosSecure.patch(
                      `/applications/${selectedApp._id}/assign-agent`,
                      {
                        status: 'Assigned',
                        agentId: selectedAgent._id,
                        agentName: selectedAgent.name,
                        agentEmail: selectedAgent.email
                      }
                    );

                    if (res.data.modifiedCount > 0) {
                      Swal.fire('Success', 'Agent assigned successfully', 'success');
                      setSelectedApp(null);
                      setSelectedAgent('');
                      refetch();
                    }
                  } catch (err) {
                    console.log(err);
                    Swal.fire('Error', 'Failed to assign agent', 'error');
                  }
                }}
                className="btn btn-sm btn-success"
                disabled={!selectedAgent}
              >
                Assign
              </button>




            </div>
          </div>
        </div>
      )
      }



      {
        selectedAppDetails && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/10 shadow-lg  flex items-center justify-center z-50">
            <div className="bg-white p-6 border border-gray-200 rounded-lg w-[400px] max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Application Details</h3>
              <p><strong>Name:</strong> {selectedAppDetails.user?.name}</p>
              <p><strong>Email:</strong> {selectedAppDetails.user?.email}</p>
              <p><strong>NID:</strong> {selectedAppDetails.user?.nid}</p>
              <p><strong>Address:</strong> {selectedAppDetails.user?.address}</p>

              <p><strong>Nominee:</strong> {selectedAppDetails.nominee?.name}</p>
              <p><strong>Relationship:</strong> {selectedAppDetails.nominee?.relationship}</p>

              <p><strong>Health Issues:</strong> {selectedAppDetails.health?.join(', ') || 'None'}</p>

              <p><strong>Policy:</strong> {selectedAppDetails.policy?.title || 'N/A'}</p>

              <p><strong>Premium:</strong> {selectedAppDetails.premium?.amount} BDT / {selectedAppDetails.premium?.frequency}</p>
              <p><strong>Status:</strong> {selectedAppDetails.status}</p>
              <p><strong>PaymentStatus:</strong> {selectedAppDetails.premium?.status}</p>
              {selectedAppDetails.status === 'Rejected' && selectedAppDetails.rejectionFeedback && (
                <p><strong>Rejection Feedback:</strong> {selectedAppDetails.rejectionFeedback}</p>
              )}
              <button
                className="btn btn-sm btn-error mt-4"
                onClick={() => setSelectedAppDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
        )
      }


      {/* feedback modal */}


      {
        selectedFeedbackApp && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] space-y-4 border shadow">
              <h3 className="text-lg font-bold text-center">Give Feedback for Rejection</h3>

              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Write reason for rejection..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              ></textarea>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedFeedbackApp(null);
                    setFeedbackText('');
                  }}
                  className="btn btn-sm btn-error"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      const res = await axiosSecure.patch(`/applications/${selectedFeedbackApp._id}/feedback`, {
                        feedback: feedbackText,
                        status: 'Rejected'
                      });

                      if (res.data.modifiedCount > 0) {
                        Swal.fire('Success!', 'Feedback submitted.', 'success');
                        setSelectedFeedbackApp(null);
                        setFeedbackText('');
                        refetch();
                      }
                    } catch (err) {
                      console.error(err);
                      Swal.fire('Error!', 'Failed to submit feedback.', 'error');
                    }
                  }}
                  className="btn btn-sm btn-success"
                  disabled={!feedbackText.trim()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )
      }



    </div >
  );
};

export default AllApplications;