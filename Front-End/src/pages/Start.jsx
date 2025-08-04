import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Start = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [animateText, setAnimateText] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger animations on component mount
        setTimeout(() => setIsVisible(true), 300);
        setTimeout(() => setAnimateText(true), 800);
    }, []);

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="h-screen relative overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
            {/* Custom Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)'
                }}
            ></div>

            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Large rotating circles */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white opacity-8 rounded-full blur-3xl animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>

                {/* Floating and morphing shapes */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-6 rounded-full blur-2xl animate-pulse" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }}></div>

                {/* Moving gradient orbs */}
                <div
                    className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-7"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        animation: 'moveHorizontal 8s ease-in-out infinite'
                    }}
                ></div>
                <div
                    className="absolute bottom-1/3 left-1/3 w-56 h-56 rounded-full blur-3xl opacity-6"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                        animation: 'moveVertical 10s ease-in-out infinite reverse'
                    }}
                ></div>

                {/* Smaller floating particles */}
                <div className="absolute top-20 right-40 w-32 h-32 bg-white opacity-12 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-40 left-40 w-24 h-24 bg-white opacity-10 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                <div className="absolute top-40 left-60 w-16 h-16 bg-white opacity-15 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>

                {/* Drifting elements */}
                <div
                    className="absolute top-1/2 left-10 w-40 h-40 bg-white opacity-8 rounded-full blur-2xl"
                    style={{ animation: 'drift 12s ease-in-out infinite' }}
                ></div>
                <div
                    className="absolute top-20 right-20 w-28 h-28 bg-white opacity-9 rounded-full blur-xl"
                    style={{ animation: 'drift 15s ease-in-out infinite reverse' }}
                ></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-screen flex items-center justify-center p-6">
                <div className="text-center max-w-2xl">
                    {/* Logo/Brand Section */}
                    <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl mb-6 border border-white border-opacity-30 shadow-2xl animate-pulse">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>

                        {/* Animated Title */}
                        <h1
                            className={`text-6xl font-bold text-white mb-4 transition-all duration-1000 delay-300 ${animateText ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: '700',
                                textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            SkillExchange
                        </h1>

                        {/* Animated Subtitle */}
                        <p
                            className={`text-2xl text-white text-opacity-90 mb-2 transition-all duration-1000 delay-500 ${animateText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}
                        >
                            Connect. Learn. Grow.
                        </p>

                        {/* Description */}
                        <p
                            className={`text-lg text-white text-opacity-80 mb-12 transition-all duration-1000 delay-700 ${animateText ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}
                        >
                            Share your skills, learn from others, and build meaningful connections
                        </p>
                    </div>

                    {/* Call to Action Button */}
                    <div className={`transition-all duration-1000 delay-1000 ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <button
                            onClick={handleGetStarted}
                            className="group relative px-12 py-4 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white border-opacity-30 rounded-2xl shadow-2xl text-white font-bold text-xl transition-all duration-300 hover:scale-110 hover:bg-opacity-30 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: '600',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            <span className="relative z-10">
                                Get Started
                            </span>

                            {/* Animated background on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Arrow animation */}
                            <svg
                                className="inline-block ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Features Preview */}
                    <div className={`mt-16 transition-all duration-1000 delay-1200 ${animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex items-center justify-center space-x-12 text-white text-opacity-90">
                            <div className="flex flex-col items-center animate-bounce delay-100">
                                <div className="w-12 h-12 bg-white bg-opacity-15 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Connect</span>
                            </div>

                            <div className="flex flex-col items-center animate-bounce delay-300">
                                <div className="w-12 h-12 bg-white bg-opacity-15 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Learn</span>
                            </div>

                            <div className="flex flex-col items-center animate-bounce delay-500">
                                <div className="w-12 h-12 bg-white bg-opacity-15 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Grow</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0px) scale(1);
                    }
                    50% { 
                        transform: translateY(-20px) scale(1.1);
                    }
                }
                
                @keyframes moveHorizontal {
                    0%, 100% { 
                        transform: translateX(0px) translateY(0px);
                    }
                    25% { 
                        transform: translateX(30px) translateY(-15px);
                    }
                    50% { 
                        transform: translateX(-20px) translateY(-30px);
                    }
                    75% { 
                        transform: translateX(-30px) translateY(15px);
                    }
                }
                
                @keyframes moveVertical {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px);
                    }
                    25% { 
                        transform: translateY(-25px) translateX(15px);
                    }
                    50% { 
                        transform: translateY(30px) translateX(-10px);
                    }
                    75% { 
                        transform: translateY(-10px) translateX(-20px);
                    }
                }
                
                @keyframes drift {
                    0%, 100% { 
                        transform: translateX(0px) translateY(0px) rotate(0deg);
                    }
                    33% { 
                        transform: translateX(30px) translateY(-20px) rotate(120deg);
                    }
                    66% { 
                        transform: translateX(-20px) translateY(30px) rotate(240deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default Start;
