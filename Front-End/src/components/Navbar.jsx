import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({
        dateRange: 'all',
        minViews: '',
        minRating: '',
        author: '',
        searchScope: 'all'
    });
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const filtersRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (filtersRef.current && !filtersRef.current.contains(event.target)) {
                setIsFiltersOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() || Object.values(filters).some(filter => filter)) {
            console.log('Searching for:', searchQuery, 'with filters:', filters);
            // Implement search logic here with filters
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            dateRange: 'all',
            minViews: '',
            minRating: '',
            author: '',
            searchScope: 'all'
        });
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(filter => filter && filter !== 'all').length;
    };

    const handleCreateCourse = () => {
        navigate('/create-course');
        console.log('Navigate to create course');
    };

    const handleLogout = () => {
        console.log('User logged out');

        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">


                    <div className="flex items-center">
                        <div
                            className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => navigate('/dashboard')}
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

                    {/* Center - Search Bar with Filters */}
                    <div className="flex-1 max-w-lg mx-8" ref={filtersRef}>
                        <form onSubmit={handleSearch} className="relative">
                            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 text-sm"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                    placeholder={
                                        filters.searchScope === 'courses' ? 'Search courses, skills, topics...' :
                                            filters.searchScope === 'users' ? 'Search instructors, experts...' :
                                                'Search courses, users, topics...'
                                    }
                                />

                                {/* Filter Button */}
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                        className={`mr-3 p-1.5 rounded-lg transition-all duration-200 ${isFiltersOpen || getActiveFiltersCount() > 0
                                            ? 'bg-indigo-100 text-indigo-600'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                                        </svg>
                                        {getActiveFiltersCount() > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {getActiveFiltersCount()}
                                            </span>
                                        )}
                                    </button>

                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="mr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filters Dropdown */}
                            {isFiltersOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-fade-in">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-gray-800">Search Filters</h3>
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    </div>

                                    {/* Search Scope Toggle - First Filter */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-gray-700 mb-2">Search In</label>
                                        <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full">
                                            {['all', 'courses', 'users'].map((scope) => (
                                                <button
                                                    key={scope}
                                                    type="button"
                                                    onClick={() => handleFilterChange('searchScope', scope)}
                                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${filters.searchScope === scope
                                                        ? 'bg-white text-indigo-600 shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                        }`}
                                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                                >
                                                    {scope === 'all' ? 'All' : scope.charAt(0).toUpperCase() + scope.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Conditionally show filters based on search scope */}
                                        {filters.searchScope !== 'users' && (
                                            <>
                                                {/* Date Range Filter */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                                                    <select
                                                        value={filters.dateRange}
                                                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                    >
                                                        <option value="all">All Time</option>
                                                        <option value="today">Today</option>
                                                        <option value="week">This Week</option>
                                                        <option value="month">This Month</option>
                                                        <option value="year">This Year</option>
                                                    </select>
                                                </div>

                                                {/* Minimum Views Filter */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Minimum Views</label>
                                                    <input
                                                        type="number"
                                                        value={filters.minViews}
                                                        onChange={(e) => handleFilterChange('minViews', e.target.value)}
                                                        placeholder="e.g. 1000"
                                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                    />
                                                </div>

                                                {/* Minimum Rating Filter */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Minimum Rating</label>
                                                    <select
                                                        value={filters.minRating}
                                                        onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                    >
                                                        <option value="">Any Rating</option>
                                                        <option value="4.5">4.5+ Stars</option>
                                                        <option value="4.0">4.0+ Stars</option>
                                                        <option value="3.5">3.5+ Stars</option>
                                                        <option value="3.0">3.0+ Stars</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        {/* Author/User Filter - Show for all scopes but with different labels */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                {filters.searchScope === 'users' ? 'User Name' : 'Author'}
                                            </label>
                                            <input
                                                type="text"
                                                value={filters.author}
                                                onChange={(e) => handleFilterChange('author', e.target.value)}
                                                placeholder={
                                                    filters.searchScope === 'users' ? 'Search by user name' : 'Search by author name'
                                                }
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        {/* User-specific filters */}
                                        {filters.searchScope === 'users' && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">User Type</label>
                                                <select
                                                    value={filters.userType || ''}
                                                    onChange={(e) => handleFilterChange('userType', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                                                >
                                                    <option value="">All Users</option>
                                                    <option value="instructor">Instructors</option>
                                                    <option value="student">Students</option>
                                                    <option value="expert">Experts</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Apply Filters Button */}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>
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
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            >
                                {/* Demo Profile Image */}
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md">
                                    JD
                                </div>
                                <svg className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                JD
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    John Doe
                                                </p>
                                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    john.doe@example.com
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Stats */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="text-lg font-bold text-indigo-600">12</p>
                                                <p className="text-xs text-gray-500">Courses</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-green-600">1.2k</p>
                                                <p className="text-xs text-gray-500">Students</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-purple-600">4.8</p>
                                                <p className="text-xs text-gray-500">Rating</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        {/* Profile */}
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>My Profile</span>
                                        </button>

                                        {/* My Courses */}
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span>My Courses</span>
                                        </button>

                                        {/* Earnings */}
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            <span>Earnings</span>
                                        </button>

                                        {/* Settings */}
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Settings</span>
                                        </button>

                                        {/* Help */}
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Help & Support</span>
                                        </button>

                                        {/* Divider */}
                                        <div className="border-t border-gray-100 my-2"></div>

                                        {/* Logout */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
        </nav>
    );
};

export default Navbar;
