import React from "react";

const UserCard = ({ user }) => {
    const {
        name,
        profileImage,
        totalCourses,
        averageRating,
        followers,
        expertise
    } = user;

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-indigo-200">
            <div className="flex items-center space-x-4">
                {/* Profile Picture - Left */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                        <img
                            src={profileImage || "https://via.placeholder.com/64x64/667eea/ffffff?text=" + (name ? name.charAt(0) : "U")}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full ring-2 ring-white"></div>
                </div>

                {/* User Info - Middle */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {expertise && (
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                                {expertise}
                            </span>
                        )}
                        {averageRating && (
                            <div className="flex items-center space-x-1">
                                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span>{averageRating}/5</span>
                            </div>
                        )}
                        {followers && (
                            <span className="text-gray-500">
                                👥 {followers > 1000 ? `${(followers / 1000).toFixed(1)}k` : followers}
                            </span>
                        )}
                    </div>
                </div>

                {/* Course Count - Right */}
                <div className="text-right">
                    <div className="bg-gradient-to-r from-indigo-600 to-cyan-400 text-white px-4 py-2 rounded-lg">
                        <div className="text-xl font-bold">{totalCourses || 0}</div>
                        <div className="text-xs opacity-90">
                            {totalCourses === 1 ? 'Course' : 'Courses'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;