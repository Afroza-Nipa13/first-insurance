import React from 'react';
import { useNavigate } from 'react-router';

const ServiceCard = ({ policy }) => {
  const { _id, title, description, imageUrl, purchaseCount } = policy;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/all-policies/${_id}`);
  };

  return (
    <div className="bg-white h-full shadow-md rounded-2xl p-4 border hover:shadow-lg hover:bg-yellow-100 cursor-pointer transition-all duration-300">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-gray-700 text-sm mb-3">{description}</p>

      <p className="text-sm text-gray-500 mb-4">Purchased: {purchaseCount} times</p>

      <button
        onClick={handleViewDetails}
        className="mt-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition"
      >
        View Details
      </button>
    </div>
  );
};

export default ServiceCard;
