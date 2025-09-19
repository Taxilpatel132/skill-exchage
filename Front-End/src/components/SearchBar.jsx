import { useState, useRef, useEffect } from 'react';

const SearchBar = () => {
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
    const filtersRef = useRef(null);

    // Close filters dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
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

    return (
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
    );
};

export default SearchBar;
