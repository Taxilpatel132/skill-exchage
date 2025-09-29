import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import UserCard from './UserCard';

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleSearchResults = (event) => {
            setSearchResults(event.detail);
            setIsLoading(false);
        };

        const handleSearchStart = () => {
            setIsLoading(true);
        };

        window.addEventListener('searchResults', handleSearchResults);
        window.addEventListener('searchStart', handleSearchStart);

        return () => {
            window.removeEventListener('searchResults', handleSearchResults);
            window.removeEventListener('searchStart', handleSearchStart);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Searching...</p>
                </div>
            </div>
        );
    }

    if (!searchResults) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500">Start searching to see results</p>
                </div>
            </div>
        );
    }

    const { data, pagination, filters } = searchResults;
    const hasResults = (data.courses && data.courses.length > 0) || (data.users && data.users.length > 0);

    if (!hasResults) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 01-2.291-6.291M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Results Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Found {pagination.totalItems} results</span>
                        {filters.query && (
                            <span>for "{filters.query}"</span>
                        )}
                        {filters.searchScope && filters.searchScope !== 'all' && (
                            <span>in {filters.searchScope}</span>
                        )}
                    </div>
                </div>

                {/* Courses Section */}
                {data.courses && data.courses.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses ({data.courses.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.courses.map(course => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Users Section */}
                {data.users && data.users.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Users ({data.users.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.users.map(user => (
                                <UserCard key={user._id} user={user} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            disabled={!pagination.hasPrev}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                        </div>

                        <button
                            disabled={!pagination.hasNext}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
