import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNewPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // API call to update password
            console.log('Updating password...');
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to success page or login
            navigate('/login');
        } catch (error) {
            console.error('Error updating password:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                fontFamily: 'Poppins, sans-serif'
            }}
        >
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-6 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-white opacity-6 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white opacity-3 rounded-full blur-2xl animate-bounce delay-500"></div>
            </div>
            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <div>
                        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 mb-6">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2
                            className="text-center text-3xl font-bold mb-2"
                            style={{
                                color: '#111827',
                                fontWeight: '700'
                            }}
                        >
                            Create New Password
                        </h2>
                        <p
                            className="text-center text-sm mb-8"
                            style={{
                                color: '#6B7280',
                                fontWeight: '400'
                            }}
                        >
                            Please enter your new password below
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        color: '#111827',
                                        fontWeight: '500'
                                    }}
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${errors.password
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-200 focus:border-indigo-500'
                                            }`}
                                        style={{
                                            backgroundColor: '#F9FAFB',
                                            color: '#111827',
                                            fontWeight: '400'
                                        }}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        color: '#111827',
                                        fontWeight: '500'
                                    }}
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${errors.confirmPassword
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-200 focus:border-indigo-500'
                                            }`}
                                        style={{
                                            backgroundColor: '#F9FAFB',
                                            color: '#111827',
                                            fontWeight: '400'
                                        }}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                style={{
                                    background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </div>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-sm transition-colors duration-200 hover:underline"
                                style={{
                                    color: '#4F46E5',
                                    fontWeight: '500'
                                }}
                            >
                                ← Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateNewPassword;