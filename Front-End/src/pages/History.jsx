import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

const History = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('myId');

    const [myData, setMyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    const [pointsSummary, setPointsSummary] = useState({
        totalGained: 0,
        totalSpent: 0,
        netTotal: 0,
        availablePoints: 0
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

            // Fetch enrollments (courses user has spent points on)
            const enrollmentsResponse = await axios.get('http://localhost:3000/users/my-enrollments', {
                withCredentials: true
            });
            const enrollmentData = enrollmentsResponse.data.enrollments || [];
            setEnrollments(enrollmentData);

            // Fetch user's own profile to get created courses
            const myId = localStorage.getItem('myId');
            const profileResponse = await axios.get(`http://localhost:3000/users/profile/${myId}`, {
                withCredentials: true
            });
            const userCoursesData = profileResponse.data.yourProfile?.coursesList || [];
            setUserCourses(userCoursesData);

            // Calculate points and create history
            calculatePointsAndHistory(enrollmentData, userCoursesData);

        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const calculatePointsAndHistory = (enrollments, courses) => {
        let totalSpent = 0;
        let totalGained = 0;
        const history = [];

        // Points spent on enrollments
        enrollments.forEach(enrollment => {
            const pointsSpent = enrollment.priceInPoints || 0;
            totalSpent += pointsSpent;

            history.push({
                id: `enrollment_${enrollment._id}`,
                type: 'spent',
                amount: pointsSpent,
                description: `Enrolled in "${enrollment.title}"`,
                topic: enrollment.categories?.[0] || 'Course Enrollment',
                date: enrollment.createdAt || new Date().toISOString(),
                courseId: enrollment._id,
                relatedType: 'enrollment'
            });
        });

        // Points gained from created courses (estimate based on enrollments and ratings)
        courses.forEach(course => {
            // Estimate points gained based on course rating and theoretical enrollments
            const basePoints = course.priceInPoints || 0;
            const ratingMultiplier = (course.averageRating || 0) / 5; // 0-1 multiplier
            const viewsMultiplier = Math.min((course.views || 0) / 100, 2); // Max 2x multiplier

            // Estimate earned points (this would ideally come from actual enrollment data)
            const estimatedEarnings = Math.floor(basePoints * ratingMultiplier * viewsMultiplier * 0.1);

            if (estimatedEarnings > 0) {
                totalGained += estimatedEarnings;

                history.push({
                    id: `course_${course._id}`,
                    type: 'earned',
                    amount: estimatedEarnings,
                    description: `Earned from teaching "${course.title}"`,
                    topic: course.categories?.[0] || 'Course Creation',
                    date: course.createdAt || new Date().toISOString(),
                    courseId: course._id,
                    relatedType: 'course_creation'
                });
            }
        });

        // Add bonus points for course completion
        enrollments.forEach(enrollment => {
            if (enrollment.isCompleted) {
                const bonusPoints = Math.floor((enrollment.priceInPoints || 0) * 0.1); // 10% bonus for completion
                totalGained += bonusPoints;

                history.push({
                    id: `completion_${enrollment._id}`,
                    type: 'earned',
                    amount: bonusPoints,
                    description: `Completion bonus for "${enrollment.title}"`,
                    topic: 'Course Completion',
                    date: enrollment.completedAt || new Date().toISOString(),
                    courseId: enrollment._id,
                    relatedType: 'completion_bonus'
                });
            }
        });

        // Sort history by date (newest first)
        history.sort((a, b) => new Date(b.date) - new Date(a.date));

        const netTotal = totalGained - totalSpent;

        setPointsSummary({
            totalGained,
            totalSpent,
            netTotal,
            availablePoints: Math.max(0, netTotal) // Can't have negative available points
        });

        setHistoryData(history);
    };

    // Filter history based on search
    const filteredHistory = historyData.filter(item => {
        const matchesSearch = searchTerm === '' ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.topic.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const getTypeIcon = (type, relatedType) => {
        if (type === 'earned') {
            if (relatedType === 'completion_bonus') {
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                );
            }
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            );
        } else {
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            );
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Navbar IsLoggedIn={isLoggedIn} myData={myData} />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white mb-4">Points History</h1>
                            <p className="text-xl text-white/90">
                                Track your learning journey and earnings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Points Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Earned</p>
                                    <p className="text-2xl font-bold text-green-600">+{pointsSummary.totalGained}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold text-red-600">-{pointsSummary.totalSpent}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Net Balance</p>
                                    <p className={`text-2xl font-bold ${pointsSummary.netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {pointsSummary.netTotal >= 0 ? '+' : ''}{pointsSummary.netTotal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Available Points</p>
                                    <p className="text-2xl font-bold text-purple-600">{pointsSummary.availablePoints}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        {/* Search Bar */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
                            <div className="relative max-w-md">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                />
                            </div>
                        </div>

                        {/* History List */}
                        {paginatedHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Found</h3>
                                <p className="text-gray-600">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Start enrolling in courses or creating content to see your points history'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {paginatedHistory.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-indigo-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.type === 'earned'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {getTypeIcon(item.type, item.relatedType)}
                                                        <span className="ml-1">
                                                            {item.type === 'earned' ? 'Earned' : 'Spent'}
                                                        </span>
                                                    </span>
                                                    <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                                        {item.topic}
                                                    </span>
                                                    {item.relatedType === 'completion_bonus' && (
                                                        <span className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                                                            Bonus
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-900 font-medium text-lg mb-2">{item.description}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{formatDate(item.date)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-6">
                                                <div className={`text-2xl font-bold ${item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {item.type === 'earned' ? '+' : '-'}{item.amount}
                                                </div>
                                                <div className="text-xs text-gray-500">points</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-semibold text-indigo-600">{startIndex + 1}</span> to{' '}
                                    <span className="font-semibold text-indigo-600">
                                        {Math.min(startIndex + itemsPerPage, filteredHistory.length)}
                                    </span>{' '}
                                    of <span className="font-semibold text-indigo-600">{filteredHistory.length}</span> entries
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white'
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    <span className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default History;
