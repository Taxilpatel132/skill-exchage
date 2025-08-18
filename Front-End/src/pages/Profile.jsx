import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';

const Profile = () => {
    const [showFullBio, setShowFullBio] = useState(false);

    // Demo user data
    const user = {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        profileImage: "https://imgs.search.brave.com/zezMWXvqTAoauw6kcChSPgmu38EVMBrAOJK489wiYVk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/NTI3NzI5NC9maWxl/L29yaWdpbmFsLWMw/MDk0NTgxMTkxZTky/Mzk5Yzc0ZWIwOWI1/M2E1YWNiLnBuZz9m/b3JtYXQ9d2VicCZy/ZXNpemU9NDAweDMw/MCZ2ZXJ0aWNhbD1j/ZW50ZXI",
        bio: "Passionate full-stack developer and UI/UX enthusiast. I love teaching others and sharing knowledge about modern web technologies, design principles, and creative problem-solving techniues",
        totalViews: 15420,
        averageRating: 4.8,
        totalCourses: 12,
        followers: 1248,
        following: 432,
        joinedDate: "January 2023"
    };

    // Demo courses data
    const userCourses = [
        {
            _id: "1",
            title: "React Hooks Mastery",
            description: "Deep dive into React Hooks with practical examples and real-world projects.",
            advisor: { name: "Alex Johnson" },
            priceInPoints: 25,
            categories: ["Programming"],
            tags: ["React", "Hooks", "JavaScript"],
            thumbnail: "https://imgs.search.brave.com/-xqPuBFI7OtX3JG9nwNYfur0xE3KjPo_BKVlc4H2xqg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/aGFzaG5vZGUuY29t/L3Jlcy9oYXNobm9k/ZS9pbWFnZS91cGxv/YWQvdjE2Nzk0NTMx/Mjg0OTgvNTBkNTI1/OTktMDUxMy00NmU1/LThiODctNjJkMDI0/NDU3MTBiLnBuZz93/PTE2MDAmaD04NDAm/Zml0PWNyb3AmY3Jv/cD1lbnRyb3B5JmF1/dG89Y29tcHJlc3Ms/Zm9ybWF0JmZvcm1h/dD13ZWJw",
            averageRating: 4.9,
            totalRatings: 234,
            status: "on_going",
            views: 3200,
            createdAt: "2024-01-15T10:00:00Z",
            type: "video"
        },
        {
            _id: "2",
            title: "Modern CSS Techniques",
            description: "Learn advanced CSS techniques including Grid, Flexbox, and animations.",
            advisor: { name: "Alex Johnson" },
            priceInPoints: 20,
            categories: ["Design"],
            tags: ["CSS", "Grid", "Flexbox"],
            thumbnail: "https://imgs.search.brave.com/zZQEn9xcJFvkzA9PUColDq_7UXDPU8vkOccqTsy1sxA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pdHZp/ZWMuY29tL2Jsb2cv/d3AtY29udGVudC91/cGxvYWRzLzIwMjQv/MDMvVGh1bWJuYWls/LWNzcy12aXBwcm8u/cG5n",
            averageRating: 4.7,
            totalRatings: 189,
            status: "complete",
            views: 2800,
            createdAt: "2024-01-10T14:30:00Z",
            type: "pdf"
        },
        {
            _id: "3",
            title: "JavaScript Fundamentals",
            description: "Complete beginner's guide to JavaScript programming language.",
            advisor: { name: "Alex Johnson" },
            priceInPoints: 15,
            categories: ["Programming"],
            tags: ["JavaScript", "Fundamentals", "Beginner"],
            thumbnail: "https://imgs.search.brave.com/vnqK7vW7UlS8xQPgJWgiamTDsgUYDxVu8h4ve-6UtaQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8w/NC8yMy8xNy80MS9q/YXZhc2NyaXB0LTcz/NjQwMV82NDAucG5n",
            averageRating: 4.8,
            totalRatings: 456,
            status: "complete",
            views: 5200,
            createdAt: "2024-01-05T09:15:00Z",
            type: "live"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section with Gradient Background */}
                <div className="relative">
                    <div
                        className="h-64 w-full"
                        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-10 right-20 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                            <div className="absolute bottom-16 right-40 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                            <div className="absolute top-20 left-1/3 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
                        </div>
                    </div>

                    {/* Profile Content Container */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative -mt-32">
                            <div className="flex flex-col lg:flex-row items-start lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
                                {/* Profile Image - Half in gradient, half out */}
                                <div className="relative">
                                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl ring-8 ring-white">
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Online Status Indicator */}
                                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-400 rounded-full ring-4 ring-white"></div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 min-h-[200px]">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="mb-6 lg:mb-0">
                                            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                {user.name}
                                            </h1>
                                            <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                {user.email}
                                            </p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <span>👥 {user.followers} followers</span>
                                                <span>🔗 {user.following} following</span>
                                                <span>📅 Joined {user.joinedDate}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-3 mt-4 lg:mt-0 justify-center lg:justify-end w-full  lg:w-auto color-gray-900">

                                            <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200">
                                                Share Profile
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* About Me Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    About Me
                                    <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full"></div>
                                </h2>
                                <div className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    <p className={`transition-all duration-300 ${!showFullBio ? 'line-clamp-4' : ''}`}>
                                        {user.bio}
                                    </p>
                                    {user.bio.length > 200 && (
                                        <button
                                            onClick={() => setShowFullBio(!showFullBio)}
                                            className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200 flex items-center space-x-1"
                                        >
                                            <span>{showFullBio ? 'Show Less' : 'Show More'}</span>
                                            <svg
                                                className={`h-4 w-4 transition-transform duration-200 ${showFullBio ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* My Courses Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0 relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        My Courses ({userCourses.length})
                                        <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full"></div>
                                    </h2>

                                    <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-indigo-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Create Course</span>
                                    </button>
                                </div>

                                {/* Course Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userCourses.map(course => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </div>

                                {userCourses.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                                        <p className="text-gray-600">Start creating your first course to share your knowledge with others.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                {/* Profile Stats */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Profile Status
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Total Views */}
                                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">📊 Total Profile Views</p>
                                                <p className="text-2xl font-bold text-gray-900">{user.totalViews.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Average Rating */}
                                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <svg className="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">⭐ Average Course Rating</p>
                                                <p className="text-2xl font-bold text-gray-900">{user.averageRating}/5.0</p>
                                            </div>
                                        </div>

                                        {/* Total Courses */}
                                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">📚 Total Courses</p>
                                                <p className="text-2xl font-bold text-gray-900">{user.totalCourses}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
};

export default Profile;