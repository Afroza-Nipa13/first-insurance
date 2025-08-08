import { Link, useParams } from 'react-router'
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../../Shared/LoadingSpinner'
import Container from '../../Shared/Container'

const PolicyDetails = () => {
    const { id } = useParams()
    const axiosSecure = useAxiosSecure()

    const { data: policy, isLoading } = useQuery({
        queryKey: ['policy', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-policies/${id}`)
            return res.data
        }
    })

    if (isLoading || !policy) return <LoadingSpinner></LoadingSpinner>

    

    return (
        <Container>
            <div className='max-w-5xl mx-auto p-6 pt-24 mt-25 shadow-2xl m-6 rounded-2xl'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start space-y-10'>
                    {/* Image */}
                    <img src={policy?.imageUrl} alt={policy?.title} className='w-full rounded-xl shadow-md' />

                    {/* Info */}
                    <div className='space-y-8'>
                        <h2 className='text-4xl font-bold text-primary divider mb-5'>{policy?.title}</h2>
                        <p className='text-gray-600'>{policy?.description}</p>

                        <div className='text-lg mt-6 space-y-6'>
                            <p><strong>Category:</strong> {policy?.category}</p>
                            <p><strong>Eligibility Age:</strong> {policy?.minAge} - {policy?.maxAge} years</p>
                            <p><strong>Coverage:</strong> ৳{policy?.coverageRange?.min?.toLocaleString()} - ৳{policy.coverageRange?.max?.toLocaleString()}</p>
                            <p><strong>Term Length Options:</strong> {policy?.durationOptions.join(' or ')} years</p>
                            <p><strong>Base Premium Rate:</strong> {(policy?.basePremiumRate * 100).toFixed(2)}</p>
                        </div>

                        {/* Booking Button */}
                        <div className='flex gap-4 mt-6'>
                            <Link to={`/quote/${policy._id}`}>
                                <button className='btn btn-outline btn-primary'>Get Quote</button>
                            </Link>

                            
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default PolicyDetails
