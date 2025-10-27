import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminNavbar = () => {
    const navigate = useNavigate();

    // Search & Filter State
    const [mode, setMode] = useState("search"); // "search" | "filter"
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const categories = [
        "Web Dev",
        "AI/ML",
        "Design",
        "Data Science",
        "Mobile Development",
        "Business",
        "Marketing",
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (mode === "search" && !searchText.trim()) {
            alert("Please enter a search term");
            return;
        }

        if (mode === "filter" && !selectedCategory) {
            alert("Please select a category");
            return;
        }

        setIsSearching(true);
        try {
            let endpoint = mode === "search" ? '/admin/search/users' : '/admin/search/courses';
            let params = mode === "search"
                ? { query: searchText }
                : { category: selectedCategory };

            const response = await axios.get(`http://localhost:3000${endpoint}`, {
                params,
                withCredentials: true
            });

            if (response.data.success) {
                console.log('Search results:', response.data);
                window.dispatchEvent(new CustomEvent('adminSearchResults', {
                    detail: response.data
                }));
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchText("");
        setSelectedCategory("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleLogout = () => {
        // Add logout logic here
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div
                            className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center mr-3 shadow-md"
                                style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
                                Admin Panel
                            </span>
                        </div>
                    </div>

                    {/* Search & Filter - Center */}
                    <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
                        <form onSubmit={handleSearch} className="flex items-center gap-3">
                            {/* Mode Toggle */}
                            <div className="flex rounded-lg bg-gray-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode("search");
                                        setSelectedCategory("");
                                    }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "search"
                                            ? "bg-white text-[#4F46E5] shadow-sm"
                                            : "text-[#111827] opacity-60 hover:opacity-80"
                                        }`}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    Search Users
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode("filter");
                                        setSearchText("");
                                    }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "filter"
                                            ? "bg-white text-[#4F46E5] shadow-sm"
                                            : "text-[#111827] opacity-60 hover:opacity-80"
                                        }`}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    Filter Courses
                                </button>
                            </div>

                            {/* Search Input / Category Dropdown */}
                            {mode === "search" ? (
                                <div className="flex-1 relative">
                                    <div className="flex items-center rounded-lg border border-[#4F46E5]/30 bg-white px-3 py-2 shadow-sm">
                                        <svg
                                            className="w-4 h-4 text-gray-400 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search users by name or email..."
                                            className="flex-1 bg-transparent outline-none text-[#111827] placeholder-gray-400 text-sm"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                        {searchText && (
                                            <button
                                                type="button"
                                                onClick={handleClear}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 relative">
                                    <select
                                        className="w-full rounded-lg border border-[#4F46E5]/30 px-3 py-2 text-[#111827] shadow-sm outline-none appearance-none cursor-pointer text-sm"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Filter by category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <svg
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                                    style={{
                                        background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                >
                                    {isSearching ? (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            {mode === "search" ? "Search" : "Filter"}
                                        </>
                                    )}
                                </button>

                                {(searchText || selectedCategory) && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-[#111827] hover:bg-gray-50 transition-all"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Admin Profile Dropdown */}
                        <div className="relative">
                            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)' }}>
                                    <span className="text-white text-sm font-semibold">A</span>
                                </div>
                                <span className="text-sm font-medium text-[#111827] hidden md:block" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Admin
                                </span>
                            </button>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-[#111827] font-medium text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
