import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import EnrolledCourseCard from '../components/EnrolledCourseCard';

const MyEnrollments = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('myId');

    const [myData, setMyData] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        inProgress: 0,
        completed: 0,
        totalHours: 0,
        actualHoursSpent: 0
    });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [isLoggedIn, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch user data
            const userResponse = await axios.get('http://localhost:3000/users/mycard', {
                withCredentials: true
            });
            setMyData(userResponse.data.usercard);

            // Fetch enrollments with progress
            const enrollmentsResponse = await axios.get('http://localhost:3000/users/my-enrollments', {
                withCredentials: true
            });

            const enrollmentData = enrollmentsResponse.data.enrollments || [];
            const statsData = enrollmentsResponse.data.stats || {
                totalCourses: 0,
                inProgress: 0,
                completed: 0,
                totalHours: 0,
                actualHoursSpent: 0
            };

            setEnrollments(enrollmentData);
            setStats(statsData);

        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert('Failed to load enrollments');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to update progress
    const updateProgress = async (courseId, moduleId, timeSpent = 0) => {
        try {
            const response = await axios.post('http://localhost:3000/users/update-progress', {
                courseId,
                moduleId,
                timeSpent
            }, { withCredentials: true });

            if (response.status === 200) {
                // Refresh data to show updated progress
                fetchData();
            }
        } catch (error) {
            console.error('Failed to update progress:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }
    console.log(myData)
    return (
        <>
            <Navbar IsLoggedIn={isLoggedIn} myData={myData} />
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white mb-4">My Learning Journey</h1>
                            <p className="text-xl text-white/90">
                                Continue your progress and explore new skills
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}


                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                My Enrolled Courses ({enrollments.length})
                            </h2>
                            <button
                                onClick={() => navigate('/courses')}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Explore More Courses</span>
                            </button>
                        </div>

                        {enrollments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrollments.map(course => (
                                    <EnrolledCourseCard
                                        key={course._id}
                                        course={course}
                                        onProgressUpdate={updateProgress}
                                        onRefresh={() => fetchData()}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">No Enrollments Yet</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Start your learning journey by enrolling in courses that match your interests and career goals.
                                </p>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Browse Courses
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyEnrollments;
