import React from 'react';

const CourseCard = ({ course }) => {
    const {
        title,
        description,
        advisor,
        priceInPoints,
        categories,
        tags,
        thumbnail,
        averageRating,
        totalRatings,
        status,
        views,
        createdAt
    } = course;

    const getStatusColor = (status) => {
        switch (status) {
            case 'coming_soon': return 'bg-blue-100 text-blue-800';
            case 'on_going': return 'bg-green-100 text-green-800';
            case 'complete': return 'bg-gray-100 text-gray-800';
            case 'blocked': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="text-yellow-400">★</span>);
        }
        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-400">☆</span>);
        }
        for (let i = stars.length; i < 5; i++) {
            stars.push(<span key={i} className="text-gray-300">☆</span>);
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Thumbnail */}
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status.replace('_', ' ').toUpperCase()}
                </span>
            </div>

            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {description}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {categories.map((category, index) => (
                        <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                        >
                            {category}
                        </span>
                    ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                        >
                            #{tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{tags.length - 3} more</span>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                    <div className="flex items-center">
                        {renderStars(averageRating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                        {averageRating.toFixed(1)} ({totalRatings} reviews)
                    </span>
                </div>

                {/* Advisor and Price */}
                <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-600">
                        By: <span className="font-medium">{advisor.name || 'Instructor'}</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                        {priceInPoints} pts
                    </div>
                </div>

                {/* Views and Date */}
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>{views} views</span>
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>

                {/* Action Button */}
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    {status === 'coming_soon' ? 'Notify Me' : 'Enroll Now'}
                </button>
            </div>
        </div>
    );
};

export default CourseCard;
