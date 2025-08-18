import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const History = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 20;

    // Mock data - Replace with actual API calls
    const [pointsSummary] = useState({
        totalGained: 125,
        totalSpent: 85,
        netTotal: 40
    });

    const [historyData] = useState([
        {
            id: 1,
            type: 'earned',
            amount: 15,
            description: 'Helped Sarah learn React fundamentals',
            topic: 'React Development',
            date: '2025-01-05',
            time: '14:30'
        },
        {
            id: 2,
            type: 'spent',
            amount: 10,
            description: 'Learned advanced JavaScript concepts',
            topic: 'JavaScript',
            date: '2025-01-04',
            time: '10:15'
        },
        {
            id: 3,
            type: 'earned',
            amount: 20,
            description: 'Created comprehensive Python tutorial',
            topic: 'Python Programming',
            date: '2025-01-03',
            time: '16:45'
        },
        {
            id: 4,
            type: 'spent',
            amount: 8,
            description: 'Attended Node.js workshop',
            topic: 'Backend Development',
            date: '2025-01-02',
            time: '11:20'
        },
        {
            id: 5,
            type: 'earned',
            amount: 12,
            description: 'Mentored junior developer in CSS',
            topic: 'CSS & Styling',
            date: '2025-01-01',
            time: '13:10'
        },

        ...Array.from({ length: 25 }, (_, i) => ({
            id: i + 6,
            type: i % 2 === 0 ? 'earned' : 'spent',
            amount: Math.floor(Math.random() * 20) + 5,
            description: i % 2 === 0 ? `Helped someone with ${['React', 'Vue', 'Angular', 'Node.js', 'Python'][i % 5]}` : `Learned ${['TypeScript', 'GraphQL', 'Docker', 'AWS', 'MongoDB'][i % 5]}`,
            topic: ['Web Development', 'Mobile Development', 'Data Science', 'DevOps', 'UI/UX'][i % 5],
            date: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
            time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }))
    ]);

    // Filter history based on search
    const filteredHistory = historyData.filter(item => {
        const matchesSearch = searchTerm === '' ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.topic.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

    const formatDate = (dateString, timeString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return `${date.toLocaleDateString('en-US', options)} at ${timeString}`;
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-['Inter'] text-[#111827]">
            {/* Modern Header with Gradient */}
            <div className="bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] shadow-lg">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-white font-weight-700">Points History</h1>
                    <p className="text-blue-100 mt-2 font-weight-400">Track your learning journey and achievements</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Modern Points Summary with Gradient Accents */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-xl font-semibold text-[#111827] mb-6 font-weight-600">Points Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-green-600 font-weight-700">+{pointsSummary.totalGained}</div>
                            <div className="text-sm text-green-700 font-weight-500 mt-1">Total Gained</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-red-600 font-weight-700">-{pointsSummary.totalSpent}</div>
                            <div className="text-sm text-red-700 font-weight-500 mt-1">Total Spent</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-[#4F46E5]/10 to-[#22D3EE]/10 rounded-xl border border-[#4F46E5]/20 hover:shadow-lg transition-shadow">
                            <div className={`text-3xl font-bold font-weight-700 ${pointsSummary.netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {pointsSummary.netTotal >= 0 ? '+' : ''}{pointsSummary.netTotal}
                            </div>
                            <div className="text-sm text-[#4F46E5] font-weight-500 mt-1">Net Balance</div>
                        </div>
                    </div>
                </div>

                {/* Modern Search with Gradient Border */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="relative max-w-md">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4F46E5]" />
                        <input
                            type="text"
                            placeholder="Search your history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors font-weight-400"
                        />
                    </div>
                </div>

                {/* Modern History List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-[#4F46E5]/5 to-[#22D3EE]/5 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-[#111827] font-weight-600">
                            Transaction History
                        </h3>
                        <p className="text-[#4F46E5] font-weight-500 mt-1">
                            {filteredHistory.length} total entries
                        </p>
                    </div>

                    {paginatedHistory.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-lg font-weight-500">No history found</div>
                            <p className="text-gray-500 font-weight-400 mt-2">Try adjusting your search terms</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {paginatedHistory.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-gradient-to-r hover:from-[#4F46E5]/5 hover:to-[#22D3EE]/5 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-weight-600 ${item.type === 'earned'
                                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                                                    : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                                                    }`}>
                                                    {item.type === 'earned' ? (
                                                        <>
                                                            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                                                            Earned
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                                                            Spent
                                                        </>
                                                    )}
                                                </span>
                                                <span className="text-xs text-[#4F46E5] bg-gradient-to-r from-[#4F46E5]/10 to-[#22D3EE]/10 px-3 py-1 rounded-full font-weight-500">
                                                    {item.topic}
                                                </span>
                                            </div>
                                            <p className="text-[#111827] font-weight-500 text-lg mb-2">{item.description}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CalendarIcon className="h-4 w-4 text-[#22D3EE]" />
                                                <span className="font-weight-400">{formatDate(item.date, item.time)}</span>
                                            </div>
                                        </div>
                                        <div className="text-right ml-6">
                                            <div className={`text-2xl font-bold font-weight-700 ${item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {item.type === 'earned' ? '+' : '-'}{item.amount}
                                            </div>
                                            <div className="text-xs text-gray-500 font-weight-500">points</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modern Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="text-sm text-gray-700 font-weight-400">
                            Showing <span className="font-weight-600 text-[#4F46E5]">{startIndex + 1}</span> to <span className="font-weight-600 text-[#4F46E5]">{Math.min(startIndex + itemsPerPage, filteredHistory.length)}</span> of <span className="font-weight-600 text-[#4F46E5]">{filteredHistory.length}</span> entries
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-weight-500 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#22D3EE] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-gray-600"
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                                Previous
                            </button>

                            <span className="px-4 py-2 text-sm font-weight-600 text-[#4F46E5] bg-gradient-to-r from-[#4F46E5]/10 to-[#22D3EE]/10 rounded-lg">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-weight-500 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#22D3EE] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-gray-600"
                            >
                                Next
                                <ChevronRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;