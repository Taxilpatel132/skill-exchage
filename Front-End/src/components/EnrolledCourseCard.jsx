import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnrolledCourseCard = ({ course, onProgressUpdate, onRefresh }) => {
    const navigate = useNavigate();

    const {
        _id,
        title,
        description,
        advisor,
        thumbnail,
        averageRating,
        totalRatings,
        createdAt,
        progress = 0,
        isCompleted = false,
        completedAt,
        totalTimeSpent = 0,
        lastAccessedAt,
        totalModules = 0,
        completedModules = 0,
        estimatedHours = 0
    } = course;

    const handleCardClick = () => {
        navigate(`/course/${_id}`);
    };

    const handleContinueLearning = (e) => {
        e.stopPropagation();
        navigate(`/course/${_id}`);
    };

    const getProgressColor = (progress) => {
        if (progress === 0) return 'bg-gray-200';
        if (progress < 30) return 'bg-red-400';
        if (progress < 70) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    const getStatusBadge = (progress, isCompleted) => {
        if (isCompleted) {
            return (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Completed
                </span>
            );
        } else if (progress === 0) {
            return (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    Not Started
                </span>
            );
        } else {
            return (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {progress}% Complete
                </span>
            );
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
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group border border-gray-100"
            onClick={handleCardClick}
        >
            {/* Thumbnail */}
            <div className="relative overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    {getStatusBadge(progress, isCompleted)}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {advisor?.fullname?.[0] || 'I'}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                        {advisor?.fullname || 'Instructor'}
                    </span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                    <div className="flex items-center">
                        {renderStars(averageRating || 0)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                        {(averageRating || 0).toFixed(1)} ({totalRatings || 0} reviews)
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-gray-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Progress Details */}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{completedModules}/{totalModules} modules</span>
                        <span>{Math.round(totalTimeSpent / 60 * 10) / 10}h spent</span>
                    </div>
                </div>

                {/* Completion Date or Last Accessed */}
                <div className="text-xs text-gray-500 mb-4 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {isCompleted ? (
                        `Completed ${new Date(completedAt).toLocaleDateString()}`
                    ) : (
                        `Last accessed ${new Date(lastAccessedAt).toLocaleDateString()}`
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={handleContinueLearning}
                    className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-700 hover:to-cyan-600 hover:scale-105"
                >
                    <span className="flex items-center justify-center">
                        {progress === 0 ? (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Learning
                            </>
                        ) : isCompleted ? (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Review Course
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Continue Learning
                            </>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default EnrolledCourseCard;
