import React, { useState, useRef, useEffect } from 'react';
import StarRating from '../components/StarRating';
import QASection from '../components/QASection';
import ReviewsSection from '../components/ReviewsSection';
import CourseNavbar from '../components/CourseNavbar';
import ModulesSection from '../components/ModulesSection';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // State for actual data
    const [course, setCourse] = useState(null);
    const [advisor, setAdvisor] = useState(null);
    const [modules, setModules] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdvisor, setIsAdvisor] = useState(false);

    // Q&A and Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, text: '' });
    const [qa, setQa] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [questionLoading, setQuestionLoading] = useState(false);

    // New states for review management - simplified
    const [myReview, setMyReview] = useState(null);
    const [otherReviews, setOtherReviews] = useState([]);

    // Advisor answer states
    const [expandedQuestionId, setExpandedQuestionId] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [answerLoading, setAnswerLoading] = useState(false);

    useEffect(() => {
        async function fetchCourse() {
            try {
                console.log('🔄 Fetching course for courseId:', courseId);
                setLoading(true);

                const courseResponse = await axios.get(
                    `http://localhost:3000/course/details/${courseId}`,
                    { withCredentials: true }
                );

                if (courseResponse.data.course) {
                    setCourse(courseResponse.data.course);
                    setAdvisor(courseResponse.data.advisor);
                    setModules(courseResponse.data.modules || []);
                }
            } catch (error) {
                console.error('❌ Error fetching course:', error);
                setError(error.response?.data?.message || 'Failed to load course');
            } finally {
                setLoading(false);
            }
        }

        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    // Fetch Q&A and Reviews data
    useEffect(() => {
        async function fetchQAData() {
            if (!courseId) return;

            try {
                // Fetch Q&A questions
                const qaResponse = await axios.get(
                    `http://localhost:3000/course/details/${courseId}/qa`,
                    { withCredentials: true }
                );

                if (qaResponse.data.questions) {
                    const formattedQA = qaResponse.data.questions.map(q => ({
                        id: q._id,
                        asker: q.studentId?.fullname ?
                            `${q.studentId.fullname.firstname} ${q.studentId.fullname.lastname}` :
                            q.studentId?.username || 'Anonymous',
                        question: q.question,
                        answer: q.answer?.text || 'Pending answer...',
                        status: q.status,
                        createdAt: q.createdAt,
                        studentId: q.studentId?._id
                    }));
                    setQa(formattedQA);
                }

                // Fetch Reviews
                const reviewsResponse = await axios.get(
                    `http://localhost:3000/course/details/${courseId}/reviews`,
                    { withCredentials: true }
                );

                if (reviewsResponse.data.reviews) {
                    const allReviews = reviewsResponse.data.reviews.map(review => ({
                        id: review._id,
                        userId: review.userId?._id,
                        name: review.userId?.fullname ?
                            `${review.userId.fullname.firstname} ${review.userId.fullname.lastname}` :
                            review.userId?.username || 'Anonymous',
                        rating: review.rating,
                        text: review.review,
                        createdAt: review.createdAt
                    }));

                    const currentUserId = localStorage.getItem('myId');
                    const userReview = allReviews.find(review => review.userId === currentUserId);
                    const othersReviews = allReviews.filter(review => review.userId !== currentUserId);

                    setMyReview(userReview || null);
                    setOtherReviews(othersReviews);

                    const orderedReviews = userReview ? [userReview, ...othersReviews] : othersReviews;
                    setReviews(orderedReviews);
                }
            } catch (error) {
                console.error('Error fetching Q&A and Reviews:', error);
            }
        }

        fetchQAData();
    }, [courseId]);

    useEffect(() => {
        if (!advisor) return;

        const currentUserId = localStorage.getItem('myId');
        const courseAdvisorId = advisor?._id || advisor;

        const check = currentUserId && courseAdvisorId && (currentUserId === courseAdvisorId);
        setIsAdvisor(check);


    }, [advisor, courseId]);

    useEffect(() => {
        const fetchEnrollment = async () => {
            const enrollment = await axios.get(`http://localhost:3000/users/enrollment/${courseId}`, { withCredentials: true });
            setIsEnrolled(enrollment.data.enrollment);
        }
        fetchEnrollment();
    }, [courseId]);
    const handleEnrollment = async () => {
        const myId = localStorage.getItem('myId');
        const token = localStorage.getItem('token');
        const isAuthenticated = (myId && myId !== 'null' && myId !== 'undefined') ||
            (token && token !== 'null' && token !== 'undefined');

        if (!isAuthenticated) {
            alert('Please log in to enroll in this course');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/course/search/${courseId}/enroll`, { withCredentials: true });
            if (response.status === 201) {
                setIsEnrolled(true);
                setProgress(0);
                alert('Successfully enrolled in the course!');
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            if (error.response?.status === 401) {
                alert('Please log in to enroll in this course');
            } else {
                alert(error.response?.data?.message || 'Failed to enroll in course');
            }
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();

        const myId = localStorage.getItem('myId');
        const token = localStorage.getItem('token');
        const isAuthenticated = (myId && myId !== 'null' && myId !== 'undefined') ||
            (token && token !== 'null' && token !== 'undefined');

        if (!isAuthenticated) {
            alert('Please log in to add a review');
            return;
        }

        if (!reviewForm.rating || !reviewForm.text) {
            alert('Please provide both rating and review text');
            return;
        }

        setReviewLoading(true);
        try {
            const response = await axios.post(`http://localhost:3000/course/details/${courseId}/rate`, {
                rating: reviewForm.rating,
                review: reviewForm.text
            }, { withCredentials: true });

            if (response.status === 201) {
                const newReview = {
                    id: Date.now(),
                    userId: myId,
                    name: reviewForm.name || 'You',
                    rating: reviewForm.rating,
                    text: reviewForm.text,
                    createdAt: new Date()
                };

                // Update myReview and reorder reviews
                setMyReview(newReview);
                const orderedReviews = [newReview, ...otherReviews];
                setReviews(orderedReviews);

                // Clear form
                setReviewForm({ name: '', rating: 0, text: '' });
                alert('Review submitted successfully!');

                // Refresh reviews from server
                try {
                    const reviewsResponse = await axios.get(`http://localhost:3000/course/details/${courseId}/reviews`, { withCredentials: true });

                    if (reviewsResponse.data.reviews) {
                        const allReviews = reviewsResponse.data.reviews.map(review => ({
                            id: review._id,
                            userId: review.userId?._id,
                            name: review.userId?.fullname ?
                                `${review.userId.fullname.firstname} ${review.userId.fullname.lastname}` :
                                review.userId?.username || 'Anonymous',
                            rating: review.rating,
                            text: review.review,
                            createdAt: review.createdAt
                        }));

                        const userReview = allReviews.find(review => review.userId === myId);
                        const othersReviews = allReviews.filter(review => review.userId !== myId);

                        setMyReview(userReview || null);
                        setOtherReviews(othersReviews);

                        const orderedReviews = userReview ? [userReview, ...othersReviews] : othersReviews;
                        setReviews(orderedReviews);
                    }
                } catch (refreshError) {
                    console.log('Failed to refresh reviews:', refreshError);
                }
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();

        const myId = localStorage.getItem('myId');
        const token = localStorage.getItem('token');
        const isAuthenticated = (myId && myId !== 'null' && myId !== 'undefined') ||
            (token && token !== 'null' && token !== 'undefined');

        if (!isAuthenticated) {
            alert('Please log in to ask a question');
            return;
        }

        if (!questionText.trim()) {
            alert('Please enter a question');
            return;
        }

        setQuestionLoading(true);
        try {
            const response = await axios.post(`http://localhost:3000/course/details/${courseId}/question`, {
                question: questionText.trim()
            }, { withCredentials: true });

            if (response.status === 201) {
                // Refresh Q&A data from server
                try {
                    const qaResponse = await axios.get(
                        `http://localhost:3000/course/details/${courseId}/qa`,
                        { withCredentials: true }
                    );

                    if (qaResponse.data.questions) {
                        const formattedQA = qaResponse.data.questions.map(q => ({
                            id: q._id,
                            asker: q.studentId?.fullname ?
                                `${q.studentId.fullname.firstname} ${q.studentId.fullname.lastname}` :
                                q.studentId?.username || 'Anonymous',
                            question: q.question,
                            answer: q.answer?.text || 'Pending answer...',
                            status: q.status,
                            createdAt: q.createdAt,
                            studentId: q.studentId?._id
                        }));
                        setQa(formattedQA);
                    }
                } catch (refreshError) {
                    console.log('Failed to refresh Q&A:', refreshError);
                }

                setQuestionText('');
                alert('Question submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting question:', error);
            alert(error.response?.data?.message || 'Failed to submit question');
        } finally {
            setQuestionLoading(false);
        }
    };

    // Advisor answer handler
    const handleAnswerQuestion = async (questionId) => {
        if (!answerText.trim()) {
            alert('Please enter an answer');
            return;
        }

        setAnswerLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:3000/course/details/${courseId}/question/${questionId}/answer`,
                { answer: answerText.trim() },
                { withCredentials: true }
            );

            if (response.status === 201) {
                // Refresh Q&A data from server
                try {
                    const qaResponse = await axios.get(
                        `http://localhost:3000/course/details/${courseId}/qa`,
                        { withCredentials: true }
                    );

                    if (qaResponse.data.questions) {
                        const formattedQA = qaResponse.data.questions.map(q => ({
                            id: q._id,
                            asker: q.studentId?.fullname ?
                                `${q.studentId.fullname.firstname} ${q.studentId.fullname.lastname}` :
                                q.studentId?.username || 'Anonymous',
                            question: q.question,
                            answer: q.answer?.text || 'Pending answer...',
                            status: q.status,
                            createdAt: q.createdAt,
                            studentId: q.studentId?._id
                        }));
                        setQa(formattedQA);
                    }
                } catch (refreshError) {
                    console.log('Failed to refresh Q&A:', refreshError);
                }

                setAnswerText('');
                setExpandedQuestionId(null);
                alert('Answer submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert(error.response?.data?.message || 'Failed to submit answer');
        } finally {
            setAnswerLoading(false);
        }
    };

    // Toggle question expansion for advisor
    const toggleQuestionExpansion = (questionId) => {
        setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
        if (expandedQuestionId !== questionId) {
            setAnswerText('');
        }
    };

    // References for navigation
    const overviewRef = useRef(null);
    const modulesRef = useRef(null);
    const advisorRef = useRef(null);
    const qaRef = useRef(null);
    const reviewsRef = useRef(null);

    const sections = [
        { id: 'overview', label: 'Overview', ref: overviewRef },
        { id: 'modules', label: 'Modules', ref: modulesRef },
        { id: 'advisor', label: 'Advisor', ref: advisorRef },
        { id: 'qa', label: 'Q&A', ref: qaRef },
        { id: 'reviews', label: 'Reviews', ref: reviewsRef },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Error loading course</div>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // No course data
    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="text-center">
                    <p className="text-gray-600">Course not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB', color: '#111827', fontFamily: "'Inter','Poppins',sans-serif" }}>
            <CourseNavbar title={course.title} sections={sections} />

            {/* Header Section */}
            <div
                id="overview"
                ref={overviewRef}
                className="py-16 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
                        About the Course
                    </h1>
                    <p className="text-xl text-white/90 text-center mt-4 max-w-2xl mx-auto">
                        Dive deep into course details, meet your advisor, and join thousands of students on their learning journey
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-2">
                    {/* Left Side - Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Overview Section */}
                        {course.fullDescription && (
                            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
                                <p className="text-gray-700 leading-relaxed">{course.fullDescription}</p>
                            </section>
                        )}

                        {/* Advisor Section */}
                        <section
                            id="advisor"
                            ref={advisorRef}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Your Advisor</h2>
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <img
                                        src={advisor?.avatar || 'https://i.pravatar.cc/120?img=47'}
                                        alt={advisor?.name || 'Advisor'}
                                        className="w-20 h-20 rounded-2xl object-cover shadow-md"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{advisor?.name || 'Unknown Advisor'}</h3>
                                    <p className="text-gray-600 mt-1">{advisor?.bio || 'Experienced instructor'}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <StarRating value={Math.round(advisor?.rating)} size={16} />
                                        <span className="text-sm font-medium text-gray-600">{advisor?.rating ? parseFloat(advisor.rating).toFixed(3) : "0.000"} rating</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm font-medium text-gray-600">{advisor?.experience || '5+ years experience'}</span>
                                    </div>
                                    {/* Advisor Profile Link */}
                                    {advisor?._id && (
                                        <button
                                            onClick={() => navigate(`/profile/${advisor._id}`)}
                                            className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            View Advisor Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div id="modules" ref={modulesRef}>
                            <ModulesSection
                                modules={modules}
                                isEnrolled={isEnrolled || isAdvisor}
                                course={course}
                                isAdvisor={isAdvisor}
                            />
                        </div>

                        <div id="qa" ref={qaRef}>
                            <QASection
                                qa={qa}
                                questionText={questionText}
                                setQuestionText={setQuestionText}
                                handleAddQuestion={handleAddQuestion}
                                questionLoading={questionLoading}
                                isEnrolled={isEnrolled}
                                isAdvisor={isAdvisor}
                                expandedQuestionId={expandedQuestionId}
                                answerText={answerText}
                                setAnswerText={setAnswerText}
                                handleAnswerQuestion={handleAnswerQuestion}
                                toggleQuestionExpansion={toggleQuestionExpansion}
                                answerLoading={answerLoading}
                            />
                        </div>

                        <div id="reviews" ref={reviewsRef}>
                            <ReviewsSection
                                reviews={reviews}
                                reviewForm={reviewForm}
                                setReviewForm={setReviewForm}
                                handleAddReview={handleAddReview}
                                reviewLoading={reviewLoading}
                                isEnrolled={isEnrolled}
                                myReview={myReview}
                                currentUserId={localStorage.getItem('myId')}
                                isAdvisor={isAdvisor}
                            />
                        </div>
                    </div>

                    {/* Right Side - Course Card & Enrollment */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            {/* Course Thumbnail/Trailer Video */}
                            <div className="relative rounded-xl overflow-hidden mb-5">
                                {course.trailerVideo ? (
                                    <div className="relative">
                                        {course.trailerVideo.includes('youtube.com') || course.trailerVideo.includes('youtu.be') ? (
                                            // YouTube Video Embed
                                            <div className="w-full h-60">
                                                <iframe
                                                    src={course.trailerVideo.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                    title="Course Trailer"
                                                    className="w-full h-full rounded-xl"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            // Direct Video File
                                            <video
                                                src={course.trailerVideo}
                                                poster={course.thumbnail}
                                                controls
                                                className="w-full h-60 object-cover rounded-xl"
                                                preload="metadata"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                            🎥 Course Trailer
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                            {course.modules || 0} Modules
                                        </div>
                                    </div>
                                ) : (
                                    // Fallback to thumbnail
                                    <div className="relative">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-60 object-cover"
                                        />
                                        <div className="absolute inset-0 shadow-inner border border-white/10 rounded-xl"></div>
                                        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                            {course.modules || 0} Modules
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-2xl font-bold text-gray-900">{course.pricePoints} Points</div>
                                <div className="text-sm bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full">
                                    {course.level}
                                </div>
                            </div>

                            {/* Enrollment CTA or Edit Button */}
                            {isAdvisor ? (
                                <button
                                    onClick={() => navigate(`/courses/edit/${courseId}`)}
                                    className="w-full py-3.5 px-6 mb-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                                    style={{ background: 'linear-gradient(90deg, #10B981, #059669)' }}
                                >
                                    Edit Course
                                </button>
                            ) : !isEnrolled ? (
                                <button
                                    onClick={handleEnrollment}
                                    className="w-full py-3.5 px-6 mb-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                                    style={{ background: 'linear-gradient(90deg, #4F46E5, #22D3EE)' }}
                                >
                                    Enroll Now
                                </button>
                            ) : (
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Course Progress</span>
                                        <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${progress}%`,
                                                background: 'linear-gradient(90deg, #4F46E5, #22D3EE)'
                                            }}
                                        ></div>
                                    </div>
                                    <button className="w-full py-3 px-6 rounded-xl bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition-colors duration-200">
                                        Continue Learning
                                    </button>
                                </div>
                            )}

                            {/* Course Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Duration</div>
                                        <div className="text-sm font-semibold text-gray-900">{course.duration}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Students</div>
                                        <div className="text-sm font-semibold text-gray-900">{(course.students || 0).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Certificate</div>
                                        <div className="text-sm font-semibold text-gray-900">{course.certificate ? 'Included' : 'Not Included'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Language</div>
                                        <div className="text-sm font-semibold text-gray-900">{course.language}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Covered */}
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <h3 className="text-base font-bold text-gray-900 mb-3">Skills You'll Gain</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(course.skills || []).map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-cyan-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
