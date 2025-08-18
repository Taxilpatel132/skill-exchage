import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import OTPInput from '../components/OTPInput';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();
    const emailFormRef = useRef(null);

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
        // console.log('Sending OTP to:', email);
        console.log(`${import.meta.env.VITE_API_URL}/users/send-otp`);
        const otpsend = await axios.post(`${import.meta.env.VITE_API_URL}/users/send-otp`, { email: email });

        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
            setShowOTP(true);

            gsap.to(emailFormRef.current, {
                opacity: 0,
                x: -50,
                duration: 0.5,
                ease: "power2.in"
            });
        }, 2000);
    };

    const handleOTPComplete = async (otpValue) => {
        setIsLoading(true);

        const verify = await axios.post(`${import.meta.env.VITE_API_URL}/users/verify-otp`, { email: email, otp: otpValue });
        console.log(verify);

        setTimeout(() => {
            setIsLoading(false);

            navigate('/create-new-password');
        }, 1500);
    };

    const handleBackToEmail = () => {
        setShowOTP(false);
        gsap.fromTo(emailFormRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.7)" }
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {showOTP ? 'Verify OTP' : 'Forgot Password'}
                        </h1>
                        <p className="text-white text-opacity-90 text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                            {showOTP ? 'Enter the 6-digit code sent to your email' : 'Enter your email to reset password'}
                        </p>
                    </div>

                    {/* Email Form */}
                    {!showOTP && (
                        <div ref={emailFormRef} className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white border-opacity-30">
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-1">
                                    <label htmlFor="email" className="block text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                                        Email Address
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
                                            placeholder="Enter your email address"
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

                            {/* Back to Login Link */}
                            <div className="mt-4 text-center">
                                <p className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: '#111827' }}>
                                    Remember your password?{' '}
                                    <button onClick={() => navigate('/')} className="font-medium hover:underline transition-colors duration-200" style={{ color: '#4F46E5', fontWeight: '500' }}>
                                        Back to Login
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
                            title="Enter 6-Digit Code"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;