import React, { useState } from "react";

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}
 
const StarRating: React.FC<StarRatingProps> = ({ label, value, onChange }) => {
  const [hovered, setHovered] = useState(0);
 
  return (
    <div className="star-row">
      <span className="star-label">{label}</span>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${n <= (hovered || value) ? "star--filled" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;