import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { format } from 'date-fns';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const BlogCard = ({ blog }) => {
    const axiosSecure=useAxiosSecure()
    const navigate =useNavigate()
    const { _id, title, content, image, author, publishDate, visitCount } = blog;


    const handleReadMore = async (id) => {
        
        await axiosSecure.patch(`/blogs/${id}/visit`);
        
        navigate(`/blogs/${_id}`);
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform duration-300"
        >
            <img src={image || 'https://i.ibb.co/Y3fKn7F/default-avatar.jpg'} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-gray-600">{content?.slice(0, 100)}...</p>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-indigo-500" />
                        <span className="badge badge-outline">{author}</span>
                    </div>
                    <span>{format(new Date(publishDate), 'PPP')}</span>
                </div>

                <div className="flex justify-between mt-4 items-center text-sm">
                    <span className="text-gray-500">👁️ {visitCount || 0}</span>
                    
                        <button onClick={()=>{handleReadMore(_id) }} className="btn btn-sm btn-primary">Read More</button>
                    
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;