import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CourseNavbar = ({ title, sections }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [isSticky, setIsSticky] = useState(false);

    // Handle scroll to make navbar sticky
    useEffect(() => {
        const handleScroll = () => {
            // Make navbar sticky after scrolling past header
            const offset = window.scrollY;
            if (offset > 300) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }

            // Update active section based on scroll position
            const position = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.ref.current) {
                    const element = section.ref.current;
                    if (element.offsetTop <= position) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    // Function to handle smooth scroll to sections
    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            const yOffset = -80; // Offset for navbar height
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={`bg-white border-b border-gray-200 transition-all duration-300 z-30 ${isSticky ? 'sticky top-0 shadow-md' : ''
                }`}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Course navigation */}
                    <div className="flex items-center space-x-8">
                        {isSticky && (
                            <div className="text-indigo-600 font-medium text-sm hidden md:block truncate max-w-[200px]">
                                {title}
                            </div>
                        )}

                        <div className="flex space-x-4">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeSection === section.id
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                            <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Courses
                        </Link>

                        <div className="hidden md:block">
                            <button className="px-4 py-2 text-sm font-medium rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                                Share Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CourseNavbar;
