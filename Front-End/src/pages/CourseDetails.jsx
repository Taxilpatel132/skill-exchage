import React, { useState, useRef, useEffect } from 'react';
import StarRating from '../components/StarRating';
import QASection from '../components/QASection';
import ReviewsSection from '../components/ReviewsSection';
import CourseNavbar from '../components/CourseNavbar';
import ModulesSection from '../components/ModulesSection';

const CourseDetails = () => {
    // Simplified course data with your theme
    const course = {
        id: 1,
        title: 'Full-Stack Web Development Bootcamp',
        description: 'Master modern web development: React, Node.js, APIs, databases, deployment & best practices.',
        skills: ['React', 'Node.js', 'REST APIs', 'MongoDB', 'Auth', 'Deployment'],
        duration: '8 Weeks • ~60 hrs',
        pricePoints: 450,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
        level: 'Intermediate',
        students: 1200,
        modules: 12,
        lastUpdated: '2024-01-15',
        certificate: true,
        language: 'English',
        category: 'Web Development'
    };

    const advisor = {
        name: 'Aisha Khan',
        avatar: 'https://i.pravatar.cc/120?img=47',
        experience: '5+ yrs | 1200+ students',
        rating: 4.8,
        bio: 'Full-Stack Developer & Tech Educator with 8+ years of experience. Taught over 500,000 students worldwide.'
    };

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [progress, setProgress] = useState(25);

    const [reviews, setReviews] = useState([
        { id: 1, name: 'Leo', rating: 5, text: 'Super clear explanations and practical projects.' },
        { id: 2, name: 'Mira', rating: 4, text: 'Great pacing. Wanted a bit more on testing.' }
    ]);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, text: '' });

    const [qa, setQa] = useState([
        { id: 1, asker: 'Sam', question: 'Do we cover JWT authentication?', answer: 'Yes, in module 4 with hands-on labs.' },
        { id: 2, asker: 'Riya', question: 'Is there a certificate?', answer: 'A shareable completion certificate is issued.' },
    ]);
    const [questionText, setQuestionText] = useState('');

    const related = [
        { id: 101, title: 'Advanced React Patterns', skills: ['Hooks', 'Context'], points: 260 },
        { id: 102, title: 'API Design with Node & Express', skills: ['REST', 'Middleware'], points: 300 },
        { id: 103, title: 'DevOps for Beginners', skills: ['CI/CD', 'Docker'], points: 280 },
    ];

    const modules = [
        {
            id: 1,
            title: 'Introduction to Web Development',
            description: 'Get started with the fundamentals of web development, understanding how the web works, and setting up your development environment.',
            duration: '2 hours',
            order: 1,
            videoUrl: 'https://example.com/video1.mp4',
            resources: [
                { title: 'Course Introduction Slides', type: 'pdf', url: '/resources/intro-slides.pdf' },
                { title: 'Development Setup Guide', type: 'pdf', url: '/resources/setup-guide.pdf' },
                { title: 'Knowledge Check Quiz', type: 'quiz', url: '/quiz/module1' }
            ]
        },
        {
            id: 2,
            title: 'HTML & CSS Fundamentals',
            description: 'Master the building blocks of web pages with HTML for structure and CSS for styling. Learn responsive design principles.',
            duration: '4 hours',
            order: 2,
            videoUrl: 'https://example.com/video2.mp4',
            resources: [
                { title: 'HTML Cheat Sheet', type: 'pdf', url: '/resources/html-cheat-sheet.pdf' },
                { title: 'CSS Grid & Flexbox Guide', type: 'pdf', url: '/resources/css-guide.pdf' },
                { title: 'Practice Exercises', type: 'link', url: '/exercises/html-css' },
                { title: 'Module 2 Assessment', type: 'quiz', url: '/quiz/module2' }
            ]
        },
        {
            id: 3,
            title: 'JavaScript Essentials',
            description: 'Learn JavaScript programming fundamentals, DOM manipulation, and modern ES6+ features that power interactive web applications.',
            duration: '6 hours',
            order: 3,
            videoUrl: 'https://example.com/video3.mp4',
            resources: [
                { title: 'JavaScript Reference Guide', type: 'pdf', url: '/resources/js-reference.pdf' },
                { title: 'Interactive Code Examples', type: 'link', url: '/examples/javascript' },
                { title: 'DOM Manipulation Lab', type: 'video', url: '/videos/dom-lab.mp4' },
                { title: 'JavaScript Quiz', type: 'quiz', url: '/quiz/module3' }
            ]
        },
        {
            id: 4,
            title: 'React Development',
            description: 'Build modern user interfaces with React. Learn components, state management, hooks, and best practices for scalable applications.',
            duration: '8 hours',
            order: 4,
            videoUrl: 'https://example.com/video4.mp4',
            resources: [
                { title: 'React Components Guide', type: 'pdf', url: '/resources/react-components.pdf' },
                { title: 'Hooks Reference', type: 'pdf', url: '/resources/react-hooks.pdf' },
                { title: 'Project Starter Code', type: 'link', url: '/projects/react-starter' },
                { title: 'React Best Practices', type: 'video', url: '/videos/react-best-practices.mp4' },
                { title: 'Final Project Assessment', type: 'quiz', url: '/quiz/module4' }
            ]
        }
    ];

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!reviewForm.name || !reviewForm.rating || !reviewForm.text) return;
        setReviews(prev => [
            { id: Date.now(), ...reviewForm },
            ...prev
        ]);
        setReviewForm({ name: '', rating: 0, text: '' });
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;
        setQa(prev => [
            { id: Date.now(), asker: 'You', question: questionText.trim(), answer: 'Pending answer...' },
            ...prev
        ]);
        setQuestionText('');
    };

    // References for each section for navigation
    const overviewRef = useRef(null);
    const modulesRef = useRef(null);
    const advisorRef = useRef(null);
    const qaRef = useRef(null);
    const reviewsRef = useRef(null);

    // Define sections for the navigation bar
    const sections = [
        { id: 'overview', label: 'Overview', ref: overviewRef },
        { id: 'modules', label: 'Modules', ref: modulesRef },
        { id: 'advisor', label: 'Advisor', ref: advisorRef },
        { id: 'qa', label: 'Q&A', ref: qaRef },
        { id: 'reviews', label: 'Reviews', ref: reviewsRef },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB', color: '#111827', fontFamily: "'Inter','Poppins',sans-serif" }}>
            {/* Course Navbar Component */}
            <CourseNavbar
                title={course.title}
                sections={sections}
            />

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
                                        src={advisor.avatar}
                                        alt={advisor.name}
                                        className="w-20 h-20 rounded-2xl object-cover shadow-md"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{advisor.name}</h3>
                                    <p className="text-gray-600 mt-1">{advisor.bio}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <StarRating value={Math.round(advisor.rating)} size={16} />
                                        <span className="text-sm font-medium text-gray-600">{advisor.rating} rating</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm font-medium text-gray-600">{advisor.experience}</span>
                                    </div>
                                    <button className="mt-4 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-100 transition-colors duration-200">
                                        View Full Profile
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Modules Section Component */}
                        <div id="modules" ref={modulesRef}>
                            <ModulesSection modules={modules} isEnrolled={isEnrolled} />
                        </div>

                        {/* Q&A Section Component */}
                        <div id="qa" ref={qaRef}>
                            <QASection
                                qa={qa}
                                questionText={questionText}
                                setQuestionText={setQuestionText}
                                handleAddQuestion={handleAddQuestion}
                            />
                        </div>

                        {/* Reviews Section Component */}
                        <div id="reviews" ref={reviewsRef}>
                            <ReviewsSection
                                reviews={reviews}
                                reviewForm={reviewForm}
                                setReviewForm={setReviewForm}
                                handleAddReview={handleAddReview}
                            />
                        </div>
                    </div>

                    {/* Right Side - Course Card & Enrollment */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            {/* Course Thumbnail */}
                            <div className="relative rounded-xl overflow-hidden mb-5">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-60 object-cover"
                                />
                                <div className="absolute inset-0 shadow-inner border border-white/10 rounded-xl"></div>
                                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                    {course.modules} Modules
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-2xl font-bold text-gray-900">{course.pricePoints} Points</div>
                                <div className="text-sm bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full">
                                    {course.level}
                                </div>
                            </div>

                            {/* Enrollment CTA */}
                            {!isEnrolled ? (
                                <button
                                    onClick={() => setIsEnrolled(true)}
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
                                        <div className="text-sm font-semibold text-gray-900">{course.students.toLocaleString()}</div>
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
                                    {course.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-cyan-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Related Courses - Compact Version */}
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                                    <span className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-cyan-400 rounded-full mr-2 inline-block"></span>
                                    You May Also Like
                                </h3>
                                <div className="space-y-4">
                                    {related.map(course => (
                                        <div
                                            key={course.id}
                                            className="bg-gradient-to-r from-white to-indigo-50/30 border border-gray-100 rounded-xl p-3.5 hover:shadow-md transition-all duration-300 hover:border-indigo-200 group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                                            <h4 className="font-semibold text-gray-900 mb-2 pl-2.5 line-clamp-1 group-hover:text-indigo-700 transition-colors">{course.title}</h4>
                                            <div className="flex flex-wrap gap-1.5 mb-3 pl-2.5">
                                                {course.skills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2.5 py-0.5 bg-white shadow-sm text-indigo-600 text-xs font-medium rounded-full border border-indigo-100/50"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between pl-2.5 pt-1 border-t border-gray-100">
                                                <div className="text-sm font-bold text-indigo-600">{course.points} Points</div>
                                                <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                                                    View
                                                </button>
                                            </div>
                                        </div>
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
