import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Notifications from './Notifications';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';

const Navbar = (props) => {

    const isLoggedIn = props.IsLoggedIn;

    const navigate = useNavigate();

    const handleCreateCourse = () => {
        navigate('/create-course');
        console.log('Navigate to create course');
    };

    const handleSignUp = () => {
        navigate('/signup');
        console.log('Navigate to signup');
    };

    const handleLogin = () => {
        navigate('/login');
        console.log('Navigate to login');
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div
                            className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center mr-3 shadow-md"
                                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                SkillExchange
                            </span>
                        </div>
                    </div>


                    <SearchBar />

                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <Notifications />

                                <button
                                    onClick={handleCreateCourse}
                                    className="flex items-center px-4 py-2 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    style={{
                                        background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Course
                                </button>

                                <ProfileDropdown mydata={props.myData} />
                            </>
                        ) : (
                            // Not logged in content
                            <>
                                {/* Sign Up Button with promotional text */}
                                <div className="flex items-center space-x-3">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Join SkillExchange Today!
                                        </p>
                                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Start learning & teaching for free
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSignUp}
                                        className="flex items-center px-6 py-2.5 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    >
                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Sign Up Free
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;