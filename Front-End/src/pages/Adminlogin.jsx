import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import OTPInput from '../components/OTPInput';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState();
    const navigate = useNavigate();
    const emailFormRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        // Initial animation for email form
        gsap.fromTo(emailFormRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
    }, []);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Animate card expansion
        gsap.to(cardRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(cardRef.current, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

        // try {
        //     let response = await axios.post(`${apiUrl}/admin/send-otp`, { email });
        //     if (response.data) {
        //         console.log('OTP sent successfully:', response.data);
        //         setOtpSent(true);
        //         showOTPField();
        //     }
        // } catch (error) {
        //     console.error('Failed to send OTP:', error);
        // } finally {
        //     setIsLoading(false);
        // }

        // Simulate for now
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
            showOTPField();
        }, 1000);
    };

    const showOTPField = () => {
        // Slide email form up and fade out
        gsap.to(emailFormRef.current, {
            y: -30,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                setShowOTP(true);
            }
        });
    };

    const handleOTPComplete = async (otpValue) => {
        setIsLoading(true);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

        try {
            let response = await axios.post(`${apiUrl}/admin/verify-otp`, {
                email,
                otp: otpValue
            });
            if (response.data) {
                console.log('Admin login successful:', response.data);
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setShowOTP(false);
        gsap.fromTo(emailFormRef.current,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
        );
    };

    const handleResendOTP = () => {
        console.log('Resending OTP to:', email);
        // Add resend logic here
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

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-6 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-white opacity-6 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white opacity-3 rounded-full blur-2xl animate-bounce delay-500"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    {/* Logo/Brand Section */}
                    <div className="text-center mb-5">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl mb-3 border border-white border-opacity-30 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {showOTP ? 'Verify OTP' : 'Admin Login'}
                        </h1>
                        <p className="text-white text-opacity-90 text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                            {showOTP ? 'Enter the 6-digit code sent to your email' : 'Secure access to admin panel'}
                        </p>
                    </div>

                    {/* Login Card */}
                    <div ref={cardRef}>
                        {/* Email Form */}
                        {!showOTP && (
                            <div ref={emailFormRef} className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white border-opacity-30">
                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    {/* Email Field */}
                                    <div className="space-y-1">
                                        <label htmlFor="email" className="block text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                                            Admin Email Address
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                                                style={{
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontWeight: '400',
                                                    color: '#111827',
                                                    borderColor: '#E5E7EB'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                                placeholder="Enter your admin email"
                                            />
                                        </div>
                                    </div>

                                    {/* Send OTP Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden mt-4 hover:scale-105 hover:shadow-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending OTP...
                                            </div>
                                        ) : (
                                            <span>Send OTP</span>
                                        )}
                                    </button>
                                </form>

                                {/* Back to User Login */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: '#111827' }}>
                                        Not an admin?{' '}
                                        <button onClick={() => navigate('/')} className="font-medium hover:underline transition-colors duration-200" style={{ color: '#4F46E5', fontWeight: '500' }}>
                                            User Login
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* OTP Component */}
                        {showOTP && (
                            <OTPInput
                                email={email}
                                isLoading={isLoading}
                                onComplete={handleOTPComplete}
                                onBack={handleBackToEmail}
                                onResend={handleResendOTP}
                                title="Enter 6-Digit Admin Code"
                                setOtp={setOtp}
                            />
                        )}
                    </div>

                    {/* Features */}
                    <div className="mt-4 text-center">
                        <div className="flex items-center justify-center space-x-6 text-white text-opacity-95">
                            <div className="flex items-center bg-white bg-opacity-15 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>Admin Access</span>
                            </div>
                            <div className="flex items-center bg-white bg-opacity-15 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;