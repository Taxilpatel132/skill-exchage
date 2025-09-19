import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseCard = ({ course, isOwnCourse = false }) => {
    const navigate = useNavigate();
    const [enrolling, setEnrolling] = useState(false);

    const {
        _id,
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

    // Check if current user is the advisor
    const currentUserId = localStorage.getItem('myId');
    const isAdvisor = isOwnCourse || advisor?._id === currentUserId;

    const handleCardClick = () => {
        navigate(`/course/${_id}`);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();

        navigate(`/edit-course/${_id}`);
    };

    const handleEnrollClick = async (e) => {
        e.stopPropagation();

        if (status === 'coming_soon') {
            // Handle notify me logic
            console.log('Notify me for course:', title);
            return;
        }

        // Check authentication
        const myId = localStorage.getItem('myId');
        const token = localStorage.getItem('token');
        const isAuthenticated = (myId && myId !== 'null' && myId !== 'undefined') ||
            (token && token !== 'null' && token !== 'undefined');

        if (!isAuthenticated) {
            alert('Please log in to enroll in this course');
            navigate('/login');
            return;
        }

        setEnrolling(true);
        try {
            const response = await axios.get(`http://localhost:3000/course/search/${_id}/enroll`, {
                withCredentials: true
            });

            if (response.status === 201) {
                alert('Successfully enrolled in the course!');

                navigate(`/course/${_id}`);
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            if (error.response?.status === 401) {
                alert('Please log in to enroll in this course');
                navigate('/login');
            } else {
                alert(error.response?.data?.message || 'Failed to enroll in course');
            }
        } finally {
            setEnrolling(false);
        }
    };

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
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group"
            onClick={handleCardClick}
        >

            <div className="relative overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform transition-all duration-300 group-hover:scale-110 ${getStatusColor(status)}`}>
                    {status?.replace('_', ' ').toUpperCase()}
                </span>


                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 truncate group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {categories?.map((category, index) => (
                        <span
                            key={index}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                        >
                            {category}
                        </span>
                    ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags?.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs hover:bg-gray-200 transition-colors duration-200"
                        >
                            #{tag}
                        </span>
                    ))}
                    {tags?.length > 3 && (
                        <span className="text-gray-400 text-xs font-medium">+{tags.length - 3} more</span>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                    <div className="flex items-center">
                        {renderStars(averageRating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 font-medium">
                        {averageRating.toFixed(1)} ({totalRatings} reviews)
                    </span>
                </div>

                {/* Advisor and Price */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                        By: <span className="font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">{advisor?.name || 'Instructor'}</span>
                    </div>
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                        {priceInPoints} pts
                    </div>
                </div>

                {/* Views and Date */}
                <div className="flex justify-between items-center text-xs text-gray-500 mb-5">
                    <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        {views} views
                    </span>
                    <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                        {new Date(createdAt).toLocaleDateString()}
                    </span>
                </div>


                {isAdvisor ? (
                    // Edit button for course advisor
                    <button
                        onClick={handleEditClick}
                        className="w-full py-3 px-4 rounded-lg transition-all duration-300 transform font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-700 hover:to-cyan-600 hover:scale-105"
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Course
                        </span>
                    </button>
                ) : (
                    // Enroll button for other users
                    <button
                        onClick={handleEnrollClick}
                        disabled={enrolling}
                        className={`w-full py-3 px-4 rounded-lg transition-all duration-300 transform font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enrolling
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105'
                            }`}
                    >
                        {status === 'coming_soon' ? (
                            <span className="flex items-center justify-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Notify Me
                            </span>
                        ) : enrolling ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enrolling...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                                Enroll Now
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseCard;