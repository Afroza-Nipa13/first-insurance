import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          onClick={() => setRating(star)}
          className={`cursor-pointer text-2xl transition ${
            rating >= star ? 'text-yellow-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
