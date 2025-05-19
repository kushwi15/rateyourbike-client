import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  editable?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  setRating, 
  editable = false,
  size = 24
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          type={editable ? "button" : "button"}
          disabled={!editable}
          onClick={() => {
            if (editable && setRating) {
              setRating(star);
            }
          }}
          className={`${editable && 'cursor-pointer'} ${!editable && 'cursor-default'} focus:outline-none transition-transform duration-200 ${editable && 'hover:scale-110'}`}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            fill={star <= rating ? '#FFB800' : 'none'}
            color={star <= rating ? '#FFB800' : '#D1D5DB'}
            size={size}
            className={star <= rating ? 'animate-pulse-once' : ''}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;