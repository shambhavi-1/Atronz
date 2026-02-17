import React, { useState } from 'react';
import '../styles/global.css';

const StarRating = ({ rating, interactive = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = interactive ? hoverRating || rating : rating;

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= displayRating ? 'filled' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            color: star <= displayRating ? '#FFD700' : '#ddd'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
