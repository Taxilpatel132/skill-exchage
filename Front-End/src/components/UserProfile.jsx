import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Demo user data - in real app this would come from context/props
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'JD',
        stats: {
            courses: 12,
            students: '1.2k',
            rating: 4.8
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /**
     * Toggle profile dropdown visibility
     */
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    /**
     * Handle profile menu item clicks
     * @param {string} action - The action to perform
     */
    const handleMenuClick = (action) => {
        setIsProfileOpen(false); // Close dropdown first

        switch (action) {
            case 'profile':
                navigate('/profile');
                break;
            case 'courses':
                navigate('/my-courses');
                break;
            case 'history':
                navigate('/history');
                break;
            case 'settings':
                navigate('/settings');
                break;
            case 'help':
                navigate('/help');
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                console.log(`Unknown action: ${action}`);
        }
    };

    /**
     * Handle user logout
     */
    const handleLogout = () => {
        console.log('User logged out');
        // Add logout logic here (clear tokens, etc.)
        navigate('/');
    };

    /**
     * Get user initials for avatar
     * @param {string} name - User's full name
     * @returns {string} - User initials
     */
    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="relative" ref={profileRef}>
            {/* Profile Button */}
            <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="User profile menu"
            >
                {/* Profile Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md">
                    {getUserInitials(user.name)}
                </div>

                {/* Dropdown Arrow */}
                <svg
                    className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                                {getUserInitials(user.name)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Stats */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-lg font-bold text-indigo-600">{user.stats.courses}</p>
                                <p className="text-xs text-gray-500">Courses</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-green-600">{user.stats.students}</p>
                                <p className="text-xs text-gray-500">Students</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-purple-600">{user.stats.rating}</p>
                                <p className="text-xs text-gray-500">Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {/* Profile */}
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleMenuClick('profile')}
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>My Profile</span>
                        </button>

                        {/* My Courses */}
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleMenuClick('courses')}
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>My Courses</span>
                        </button>

                        {/* History */}
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleMenuClick('history')}
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Points History</span>
                        </button>

                        {/* Settings */}
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleMenuClick('settings')}
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Settings</span>
                        </button>

                        {/* Help */}
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => handleMenuClick('help')}
                        >
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Help & Support</span>
                        </button>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Logout */}
                        <button
                            onClick={() => handleMenuClick('logout')}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* CSS Animation Styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default UserProfile;
