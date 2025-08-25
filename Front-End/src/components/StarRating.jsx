import React, { useState } from 'react';

const StarRating = ({ value = 0, size = 18, interactive = false, onChange }) => {
    const [hover, setHover] = useState(null);
    const display = hover ?? value;
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type={interactive ? 'button' : 'button'}
                    disabled={!interactive}
                    className="p-0.5 focus:outline-none"
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(null)}
                    onClick={() => interactive && onChange?.(star)}
                    aria-label={`Rate ${star} star`}
                >
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        className={(display >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300') + ' stroke-yellow-400'}
                        strokeWidth="2"
                    >
                        <path d="M12 17.3l-5.46 3.22 1.46-6.05L3 9.76l6.19-.53L12 3.75l2.81 5.48 6.19.53-4 4.71 1.46 6.05z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

export default StarRating;
