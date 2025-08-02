import { useState } from 'react';

const UserSignup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
        fullname: {
            firstname: '',
            lastname: ''
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'firstname' || name === 'lastname') {
            setFormData({
                ...formData,
                fullname: {
                    ...formData.fullname,
                    [name]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log('Signup submitted:', formData);
        }, 2000);
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
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
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6 py-8">
                <div className="w-full max-w-sm">
                    {/* Logo/Brand Section */}
                    <div className="text-center mb-5">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl mb-3 border border-white border-opacity-30 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            Join Us Today
                        </h1>
                        <p className="text-white text-opacity-90 text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                            Create your account to get started
                        </p>
                    </div>

                    {/* Signup Card */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white border-opacity-30">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name Row */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* First Name */}
                                <div className="space-y-1">
                                    <label htmlFor="firstname" className="block text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        value={formData.fullname.firstname}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: '400',
                                            color: '#111827',
                                            borderColor: '#E5E7EB'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                        placeholder="John"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="space-y-1">
                                    <label htmlFor="lastname" className="block text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        value={formData.fullname.lastname}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: '400',
                                            color: '#111827',
                                            borderColor: '#E5E7EB'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

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
                                        value={formData.email}
                                        onChange={handleInputChange}
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
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-1">
                                <label htmlFor="phone" className="block text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                                    Phone Number
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
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
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm"
                                        style={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: '400',
                                            color: '#111827',
                                            borderColor: '#E5E7EB'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-500 transition-colors rounded-r-lg"
                                    >
                                        {showPassword ? (
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="pt-2">
                                <div className="flex items-start">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-3.5 w-3.5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 mt-0.5"
                                        style={{ accentColor: '#4F46E5' }}
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-xs leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: '#111827' }}>
                                        I agree to the{' '}
                                        <a href="#" className="font-medium hover:underline transition-colors duration-200" style={{ color: '#4F46E5', fontWeight: '500' }}>
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="font-medium hover:underline transition-colors duration-200" style={{ color: '#4F46E5', fontWeight: '500' }}>
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
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
                                        Creating Account...
                                    </div>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-4 text-center">
                            <p className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: '#111827' }}>
                                Already have an account?{' '}
                                <a href="#" className="font-medium hover:underline transition-colors duration-200" style={{ color: '#4F46E5', fontWeight: '500' }}>
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-4 text-center">
                        <div className="flex items-center justify-center space-x-6 text-white text-opacity-95">
                            <div className="flex items-center bg-white bg-opacity-15 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>Secure</span>
                            </div>
                            <div className="flex items-center bg-white bg-opacity-15 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSignup;
