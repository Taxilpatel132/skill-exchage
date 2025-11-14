import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // State management
    const [expandedModule, setExpandedModule] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(0);

    // Demo course data
    const [courseData] = useState({
        id: courseId || '1',
        title: 'Advanced React Patterns & Performance Optimization',
        subtitle: 'Master modern React patterns, hooks, and optimization techniques to build scalable applications',
        description: 'Deep dive into advanced React concepts including custom hooks, context patterns, performance optimization, and modern state management techniques.',
        thumbnail: 'https://imgs.search.brave.com/yYFtD5QGVvpSBpMp73hYHVRi9QxnElJg5u6T7a5QQFY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2ltcGxpbGVhcm4u/Y29tL2ljZTkvZnJl/ZV9yZXNvdXJjZXNf/YXJ0aWNsZV90aHVt/Yi9SZWFjdC1Gcm9u/dGVuZF9MYW5ndWFn/ZS5QTkc',
        level: 'Intermediate',
        duration: '8 weeks',
        format: 'Live + Recorded',
        points: 150,
        enrolled: 1234,
        rating: 4.8,
        totalRatings: 456,
        tags: ['React', 'JavaScript', 'Performance', 'Hooks', 'State Management'],
        advisor: {
            id: '1',
            name: 'Sarah Johnson',
            avatar: 'SJ',
            skillLevel: 'Expert',
            experience: '8+ years',
            courses: 23,
            students: 15600,
            rating: 4.9
        },
        whatYouLearn: [
            'Master advanced React hooks and custom hook patterns',
            'Implement performance optimization techniques',
            'Build complex state management solutions',
            'Create reusable component libraries',
            'Debug and profile React applications',
            'Apply modern React architectural patterns'
        ],
        curriculum: [
            {
                id: 1,
                title: 'Advanced Hooks & Patterns',
                duration: '2 weeks',
                topics: [
                    'Custom Hooks Deep Dive',
                    'useReducer vs useState',
                    'useCallback and useMemo optimization',
                    'useRef advanced patterns',
                    'Building compound components'
                ]
            },
            {
                id: 2,
                title: 'Performance Optimization',
                duration: '2 weeks',
                topics: [
                    'React DevTools Profiler',
                    'Memoization strategies',
                    'Code splitting and lazy loading',
                    'Bundle optimization',
                    'Memory leak prevention'
                ]
            },
            {
                id: 3,
                title: 'State Management',
                duration: '2 weeks',
                topics: [
                    'Context API best practices',
                    'Zustand implementation',
                    'Redux Toolkit modern patterns',
                    'Server state with React Query',
                    'State machine concepts'
                ]
            },
            {
                id: 4,
                title: 'Advanced Patterns & Architecture',
                duration: '2 weeks',
                topics: [
                    'Render props pattern',
                    'Higher-order components',
                    'Error boundaries',
                    'Portals and refs',
                    'Testing strategies'
                ]
            }
        ],
        preview: {
            title: 'Introduction to Custom Hooks',
            description: 'Learn the fundamentals of creating custom hooks in React',
            videoUrl: '/api/placeholder/600/400',
            duration: '12:34'
        },
        resources: [
            { id: 1, name: 'React Patterns Cheatsheet', type: 'PDF', size: '2.4 MB' },
            { id: 2, name: 'Source Code Repository', type: 'ZIP', size: '45 MB' },
            { id: 3, name: 'Performance Checklist', type: 'PDF', size: '1.2 MB' },
            { id: 4, name: 'Hook Examples Collection', type: 'JS', size: '8.7 MB' }
        ],
        certificate: true
    });

    const [questions] = useState([
        {
            id: 1,
            student: { name: 'Mike Chen', avatar: 'MC' },
            question: 'What\'s the difference between useCallback and useMemo?',
            answer: 'useCallback memoizes functions while useMemo memoizes values. useCallback is specifically for function references.',
            advisor: { name: 'Sarah Johnson', avatar: 'SJ' },
            votes: 12,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            answered: true
        },
        {
            id: 2,
            student: { name: 'Emma Davis', avatar: 'ED' },
            question: 'How do you handle memory leaks in React applications?',
            answer: null,
            votes: 8,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            answered: false
        }
    ]);

    const [reviews] = useState([
        {
            id: 1,
            student: { name: 'Alex Rodriguez', avatar: 'AR' },
            rating: 5,
            comment: 'Excellent course! Sarah explains complex concepts very clearly. The performance optimization section was particularly valuable.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            helpful: 24
        },
        {
            id: 2,
            student: { name: 'Lisa Wang', avatar: 'LW' },
            rating: 5,
            comment: 'Great practical examples and hands-on exercises. Really helped me understand advanced React patterns.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            helpful: 18
        },
        {
            id: 3,
            student: { name: 'David Kim', avatar: 'DK' },
            rating: 4,
            comment: 'Good content overall, but could use more real-world examples in the state management section.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            helpful: 12
        }
    ]);

    const toggleModule = (moduleId) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    const handleEnroll = () => {
        setIsEnrolled(true);
        setProgress(0);
        // Handle enrollment logic
        console.log('Enrolling in course...');
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    const StarRating = ({ rating, size = 'sm' }) => {
        const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Course Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Info */}
                        <div className="lg:col-span-2">
                            <div className="mb-4">
                                <nav className="flex text-sm text-gray-500 mb-4">
                                    <span className="hover:text-indigo-600 cursor-pointer">Courses</span>
                                    <span className="mx-2">/</span>
                                    <span className="hover:text-indigo-600 cursor-pointer">Programming</span>
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-800">React</span>
                                </nav>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                    {courseData.title}
                                </h1>
                                <p className="text-lg text-gray-600 mb-6">
                                    {courseData.subtitle}
                                </p>
                            </div>

                            {/* Course Meta */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center">
                                    <StarRating rating={courseData.rating} size="lg" />
                                    <span className="ml-2 text-lg font-semibold text-gray-900">
                                        {courseData.rating}
                                    </span>
                                    <span className="ml-1 text-gray-600">
                                        ({courseData.totalRatings} reviews)
                                    </span>
                                </div>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-600">
                                    {courseData.enrolled.toLocaleString()} students
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-600">{courseData.level}</span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {courseData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Advisor Profile */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Meet Your Instructor</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {courseData.advisor.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-gray-900">
                                            {courseData.advisor.name}
                                        </h4>
                                        <p className="text-gray-600">
                                            {courseData.advisor.skillLevel} • {courseData.advisor.experience}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                            <span>{courseData.advisor.courses} courses</span>
                                            <span>•</span>
                                            <span>{courseData.advisor.students.toLocaleString()} students</span>
                                            <span>•</span>
                                            <div className="flex items-center">
                                                <StarRating rating={courseData.advisor.rating} />
                                                <span className="ml-1">{courseData.advisor.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/profile/${courseData.advisor.id}`)}
                                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Enrollment Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                    {/* Course Thumbnail */}
                                    <div className="relative">
                                        <img
                                            src={courseData.thumbnail}
                                            alt={courseData.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-60 transition-all duration-200">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8.5 3.5L15 10l-6.5 6.5V3.5z" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        {!isEnrolled ? (
                                            <>
                                                <div className="text-center mb-6">
                                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                                        {courseData.points} Points
                                                    </div>
                                                    <p className="text-gray-600">One-time enrollment</p>
                                                </div>

                                                <button
                                                    onClick={handleEnroll}
                                                    className="w-full py-3 px-6 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-4"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)'
                                                    }}
                                                >
                                                    Enroll for {courseData.points} Points
                                                </button>
                                            </>
                                        ) : (
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                                    <span className="text-sm font-medium text-indigo-600">{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full"
                                                        style={{
                                                            width: `${progress}%`,
                                                            background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)'
                                                        }}
                                                    ></div>
                                                </div>
                                                <button className="w-full mt-4 py-3 px-6 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)'
                                                    }}
                                                >
                                                    Continue Learning
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                            <button
                                                onClick={() => setIsBookmarked(!isBookmarked)}
                                                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${isBookmarked ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                                            </button>
                                            <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                </svg>
                                                <span>Share</span>
                                            </button>
                                        </div>

                                        {/* Course Details */}
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Duration</span>
                                                <span className="font-medium">{courseData.duration}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Format</span>
                                                <span className="font-medium">{courseData.format}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Level</span>
                                                <span className="font-medium">{courseData.level}</span>
                                            </div>
                                            {courseData.certificate && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Certificate</span>
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-medium text-green-600">Yes</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.whatYouLearn.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                            <div className="space-y-4">
                                {courseData.curriculum.map((module) => (
                                    <div key={module.id} className="border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{module.duration} • {module.topics.length} topics</p>
                                            </div>
                                            <svg
                                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedModule === module.id ? 'rotate-180' : ''
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {expandedModule === module.id && (
                                            <div className="px-6 pb-4 border-t border-gray-100">
                                                <ul className="space-y-2 mt-4">
                                                    {module.topics.map((topic, index) => (
                                                        <li key={index} className="flex items-center space-x-3 text-gray-700">
                                                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                                            </svg>
                                                            <span>{topic}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Preview Content */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview</h2>
                            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                                <img
                                    src={courseData.preview.videoUrl}
                                    alt="Preview"
                                    className="w-full h-64 object-cover"
                                />
                                <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-60 transition-all duration-200">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.5 3.5L15 10l-6.5 6.5V3.5z" />
                                        </svg>
                                    </div>
                                </button>
                                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                                    {courseData.preview.duration}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-900">{courseData.preview.title}</h3>
                                <p className="text-gray-600 mt-1">{courseData.preview.description}</p>
                            </div>
                        </section>

                        {/* Q&A Section */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="unanswered">Unanswered</option>
                                </select>
                            </div>

                            {/* Ask Question */}
                            <div className="mb-6">
                                <textarea
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="Ask a question about this course..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-indigo-500"
                                    rows={3}
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        className="px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200"
                                        style={{
                                            background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)'
                                        }}
                                    >
                                        Ask Question
                                    </button>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="space-y-6">
                                {questions.map((qa) => (
                                    <div key={qa.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {qa.student.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-semibold text-gray-900">{qa.student.name}</h4>
                                                    <span className="text-gray-500 text-sm">{getTimeAgo(qa.createdAt)}</span>
                                                    {qa.answered && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            Answered
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 mb-3">{qa.question}</p>

                                                {qa.answer && (
                                                    <div className="bg-indigo-50 border-l-4 border-indigo-500 pl-4 py-3 mb-3">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                                                {qa.advisor.avatar}
                                                            </div>
                                                            <span className="font-semibold text-indigo-900">{qa.advisor.name}</span>
                                                            <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                                                Instructor
                                                            </span>
                                                        </div>
                                                        <p className="text-indigo-800">{qa.answer}</p>
                                                    </div>
                                                )}

                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <button className="flex items-center space-x-1 hover:text-indigo-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                        <span>{qa.votes}</span>
                                                    </button>
                                                    <button className="hover:text-indigo-600">Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews & Ratings */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>

                            {/* Rating Summary */}
                            <div className="flex items-center space-x-8 mb-8 p-6 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {courseData.rating}
                                    </div>
                                    <StarRating rating={courseData.rating} size="lg" />
                                    <p className="text-gray-600 mt-2">{courseData.totalRatings} reviews</p>
                                </div>
                                <div className="flex-1">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center space-x-3 mb-2">
                                            <span className="text-sm text-gray-600 w-8">{rating}★</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                                                    style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-8">
                                                {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '8%' : rating === 2 ? '2%' : '0%'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="space-y-6">
                                {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {review.student.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-semibold text-gray-900">{review.student.name}</h4>
                                                    <StarRating rating={review.rating} />
                                                    <span className="text-gray-500 text-sm">{getTimeAgo(review.createdAt)}</span>
                                                </div>
                                                <p className="text-gray-700 mb-3">{review.comment}</p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <button className="flex items-center space-x-1 hover:text-indigo-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                        </svg>
                                                        <span>Helpful ({review.helpful})</span>
                                                    </button>
                                                    <button className="hover:text-indigo-600">Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {reviews.length > 2 && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                        className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium"
                                    >
                                        {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Resources */}
                            <section className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Resources</h3>
                                <div className="space-y-3">
                                    {courseData.resources.map((resource) => (
                                        <div key={resource.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                {resource.type === 'PDF' && (
                                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2v8h8V6H6z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {resource.type === 'ZIP' && (
                                                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {resource.type === 'JS' && (
                                                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{resource.name}</p>
                                                <p className="text-xs text-gray-500">{resource.type} • {resource.size}</p>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Similar Courses */}
                            <section className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Courses</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: 'JavaScript Fundamentals', instructor: 'Mike Chen', rating: 4.7, points: 120 },
                                        { title: 'Node.js Backend Development', instructor: 'Emma Davis', rating: 4.9, points: 180 },
                                        { title: 'Vue.js Complete Guide', instructor: 'Alex Rodriguez', rating: 4.6, points: 140 }
                                    ].map((course, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors duration-200 cursor-pointer">
                                            <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                                            <p className="text-sm text-gray-600 mb-2">By {course.instructor}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <StarRating rating={course.rating} />
                                                    <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-indigo-600">{course.points} pts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
