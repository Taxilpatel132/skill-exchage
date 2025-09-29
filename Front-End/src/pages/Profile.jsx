import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Loading from '../components/Loading';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const myId = localStorage.getItem('myId');

    const isLoggedIn = !!localStorage.getItem('myId');
    const [showFullBio, setShowFullBio] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [myData, setMyData] = useState(null);

    const isOwnProfile = !userId || (myId && userId === myId);

    useEffect(() => {
        async function fetchData() {
            if (!isLoggedIn) return;

            try {
                const response = await axios.get('http://localhost:3000/users/mycard', { withCredentials: true });
                setMyData(response.data.usercard);
            } catch (error) {
                // Failed to fetch user data
            }
        }
        fetchData();
    }, [isLoggedIn]);

    useEffect(() => {
        fetchProfileData();
    }, [myId, userId]);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            if (isOwnProfile) {
                if (myId) {
                    try {
                        const response = await axios.get(`http://localhost:3000/users/profile/${myId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true
                        });

                        const data = response.data;
                        if (response.status === 200) {
                            const userData = data.yourProfile;
                            // For own profile, it should be yourProfile
                            setProfileData({
                                name: userData.fullname,
                                email: userData.email,
                                bio: userData.bio,
                                totalViews: parseInt(userData.totalViews) || 0,
                                averageRating: parseFloat(userData.avgRating) || 0, // Changed from userData.averageRating to userData.avgRating
                                totalCourses: parseInt(userData.courses) || 0,
                                followers: parseInt(userData.followers) || 0,
                                following: parseInt(userData.following) || 0,
                                joinedDate: new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
                                profileImage: userData.profilePhoto,
                                _id: userData._id,
                                coursesList: userData.coursesList || []
                            });
                        } else {
                            throw new Error('Failed to fetch profile data');
                        }
                    } catch (error) {
                        if (myData) {
                            setProfileData({
                                name: myData.fullname || myData.email,
                                email: myData.email,
                                bio: "No bio available",
                                totalViews: 0,
                                averageRating: 0,
                                totalCourses: 0,
                                followers: 0,
                                following: 0,
                                joinedDate: "Recently",
                                profileImage: "https://imgs.search.brave.com/zezMWXvqTAoauw6kcChSPgmu38EVMBrAOJK489wiYVk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/NTI3NzI5NC9maWxl/L29yaWdpbmFsLWMw/MDk0NTgxMTkxZTky/Mzk5Yzc0ZWIwOWI1/M2E1YWNiLnBuZz9m/b3JtYXQ9d2VicCZy/ZXNpemU9NDAweDMw/MCZ2ZXJ0aWNhbD1j/ZW50ZXI",
                                _id: myData._id,
                                coursesList: []
                            });
                        }
                    }
                }
            } else {
                try {
                    const response = await axios.get(`http://localhost:3000/users/profile/${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true
                    });

                    const data = response.data;

                    if (response.status === 200) {
                        const userData = data.OtherUserProfile; // For other users, it should be OtherUserProfile
                        setProfileData({
                            name: userData.fullname,
                            email: userData.email,
                            bio: userData.bio,
                            totalViews: parseInt(userData.totalViews) || 0,
                            averageRating: parseFloat(userData.avgRating) || 0, // Changed from userData.averageRating to userData.avgRating
                            totalCourses: parseInt(userData.courses) || 0,
                            followers: parseInt(userData.followers) || 0,
                            following: parseInt(userData.following) || 0,
                            joinedDate: new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
                            profileImage: userData.profilePhoto,
                            _id: userData._id,
                            coursesList: userData.coursesList || []
                        });

                        setIsFollowing(response.data.OtherUserProfile.isFollowing);
                        // Check if current user is following this user
                        if (myData && myData.following) {
                            setIsFollowing(myData.following.includes(userId));
                        }
                    } else {
                        throw new Error('Failed to fetch profile data');
                    }
                } catch (error) {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!myData) {
            alert('Please login to follow users');
            return;
        }

        setFollowLoading(true);
        try {
            const endpoint = isFollowing
                ? `/users/unfollow/${userId}`
                : `/users/follow/${userId}`;

            const response = await axios.get(`http://localhost:3000${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setIsFollowing(!isFollowing);
                setProfileData(prev => ({
                    ...prev,
                    followers: isFollowing ? prev.followers - 1 : prev.followers + 1
                }));
            } else {
                alert(response.data.message || 'Failed to update follow status');
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            alert(error.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setFollowLoading(false);
        }
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleShareProfile = () => {
        const profileUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: `${profileData.name}'s Profile`,
                text: `Check out ${profileData.name}'s profile on Skill Exchange`,
                url: profileUrl,
            });
        } else {
            navigator.clipboard.writeText(profileUrl).then(() => {
                alert('Profile link copied to clipboard!');
            });
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!profileData) {
        return (
            <>
                <Navbar IsLoggedIn={isLoggedIn} myData={myData} />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
                        <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
                    </div>
                </div>
            </>
        );
    }

    const userCourses = profileData.coursesList || [];

    return (
        <>
            <Navbar IsLoggedIn={isLoggedIn} myData={myData} />
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
                                {/* Profile Image */}
                                <div className="relative">
                                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl ring-8 ring-white">
                                        <img
                                            src={profileData.profileImage}
                                            alt={profileData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-400 rounded-full ring-4 ring-white"></div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 min-h-[200px]">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="mb-6 lg:mb-0">
                                            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                {profileData.name}
                                            </h1>
                                            <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                {profileData.email}
                                            </p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <span>👥 {profileData.followers} followers</span>
                                                <span>🔗 {profileData.following} following</span>
                                                <span>📅 Joined {profileData.joinedDate}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-3 mt-4 lg:mt-0 justify-center lg:justify-end w-full lg:w-auto">
                                            {isOwnProfile ? (
                                                <>
                                                    <button
                                                        onClick={handleEditProfile}
                                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                    >
                                                        ✏️ Edit Profile
                                                    </button>
                                                    <button
                                                        onClick={handleShareProfile}
                                                        className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
                                                    >
                                                        📤 Share Profile
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={handleFollowToggle}
                                                        disabled={followLoading || !myData}
                                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${isFollowing
                                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-700 hover:to-cyan-600'
                                                            } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {followLoading ? (
                                                            <span className="flex items-center space-x-2">
                                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                <span>Processing...</span>
                                                            </span>
                                                        ) : (
                                                            <>{isFollowing ? '✓ Following' : '➕ Follow'}</>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={handleShareProfile}
                                                        className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
                                                    >
                                                        📤 Share Profile
                                                    </button>
                                                </>
                                            )}
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
                                    About {isOwnProfile ? 'Me' : profileData.name}
                                    <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full"></div>
                                </h2>
                                <div className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    <p className={`transition-all duration-300 ${!showFullBio ? 'line-clamp-4' : ''}`}>
                                        {profileData.bio || 'No bio available.'}
                                    </p>
                                    {profileData.bio && profileData.bio.length > 200 && (
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

                            {/* Courses Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0 relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {isOwnProfile ? 'My Courses' : `${profileData.name}'s Courses`} ({userCourses.length})
                                        <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full"></div>
                                    </h2>

                                    {isOwnProfile && (
                                        <button
                                            onClick={() => navigate('/create-course')}
                                            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-indigo-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Create Course</span>
                                        </button>
                                    )}
                                </div>

                                {/* Course Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userCourses.map(course => (
                                        <CourseCard
                                            key={course._id}
                                            course={course}
                                            isOwnCourse={isOwnProfile}
                                        />
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
                                        <p className="text-gray-600">
                                            {isOwnProfile
                                                ? 'Start creating your first course to share your knowledge with others.'
                                                : `${profileData.name} hasn't created any courses yet.`
                                            }
                                        </p>
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
                                        Profile Stats
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
                                                <p className="text-2xl font-bold text-gray-900">{profileData.totalViews.toLocaleString()}</p>
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
                                                <p className="text-2xl font-bold text-gray-900">{parseFloat(profileData.averageRating).toFixed(3)}/5.000</p>
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
                                                <p className="text-2xl font-bold text-gray-900">{profileData.totalCourses}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
};

export default Profile;