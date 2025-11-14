import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const UserLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { user, setUser } = useUser();
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log(formData)
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                // Store token in localStorage if needed
                if (data.token) {
                    console.log("hello")
                    localStorage.setItem('token', data.token);
                    setUser(data.user);

                }
                navigate('/home');
            } else {
                console.error('Login failed:', data.message);
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            Welcome Back
                        </h1>
                        <p className="text-white text-opacity-90 text-base" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                            Ready to continue your journey?
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white border-opacity-30">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#111827' }}>
                                    Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
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
                                        placeholder="Enter your username or email"
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
                                        placeholder="Enter your password"
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

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                        style={{ accentColor: '#4F46E5' }}
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: '#111827' }}>
                                        Remember me
                                    </label>
                                </div>
                                <a href="/forgot-password" className="text-xs font-medium hover:underline transition-all duration-200" style={{ color: '#4F46E5', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                                    Forgot password?
                                </a>
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
                                        Signing In...
                                    </div>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-4 text-center">
                            <p className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: '#111827' }}>
                                Don't have an account?{' '}
                                <a href="/signup" className="font-medium hover:underline transition-colors duration-200" style={{ color: '#4F46E5', fontWeight: '500' }}>
                                    Sign up for free
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
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>Trusted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;