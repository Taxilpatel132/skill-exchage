import React from 'react';

const QASection = ({
    qa,
    questionText,
    setQuestionText,
    handleAddQuestion,
    questionLoading,
    isEnrolled,
    isAdvisor,
    expandedQuestionId,
    answerText,
    setAnswerText,
    handleAnswerQuestion,
    toggleQuestionExpansion,
    answerLoading
}) => {
    return (
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions & Answers</h2>

            {/* Q&A List with Fixed Height and Scroll */}
            <div className="mb-8 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-6">
                    {qa.length > 0 ? (
                        qa.map(q => (
                            <div key={q.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-indigo-200">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                        {q.asker[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900">{q.asker}</span>
                                            <span className="text-sm text-gray-500">asks:</span>
                                            {q.createdAt && (
                                                <span className="text-xs text-gray-400 ml-auto">
                                                    {new Date(q.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-800 font-medium">{q.question}</p>
                                    </div>
                                </div>

                                <div className="ml-16 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-4 border-l-4 border-indigo-500">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                                        <span className="text-sm font-semibold text-indigo-600">
                                            {q.status === 'pending' ? 'Pending Response' : 'Advisor Response:'}
                                        </span>
                                    </div>
                                    <p className={`text-gray-800 ${q.status === 'pending' ? 'italic text-gray-500' : ''}`}>
                                        {q.answer}
                                    </p>

                                    {/* Advisor Answer Form - Only show for advisors and pending questions */}
                                    {isAdvisor && q.status === 'pending' && (
                                        <div className="mt-4 pt-4 border-t border-indigo-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold text-indigo-700">Answer this question:</span>
                                                <button
                                                    onClick={() => toggleQuestionExpansion(q.id)}
                                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                                                >
                                                    {expandedQuestionId === q.id ? 'Cancel' : 'Answer'}
                                                    <svg
                                                        className={`w-4 h-4 transition-transform ${expandedQuestionId === q.id ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {expandedQuestionId === q.id && (
                                                <div className="space-y-3">
                                                    <textarea
                                                        rows={3}
                                                        placeholder="Type your answer here..."
                                                        className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 border px-4 py-3 text-sm resize-none"
                                                        value={answerText}
                                                        onChange={e => setAnswerText(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAnswerQuestion(q.id)}
                                                            disabled={answerLoading || !answerText.trim()}
                                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${answerLoading || !answerText.trim()
                                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                                }`}
                                                        >
                                                            {answerLoading ? 'Submitting...' : 'Submit Answer'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAnswerText('');
                                                                setExpandedQuestionId(null);
                                                            }}
                                                            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500">No questions yet. Be the first to ask!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Ask Question Form - Only show if enrolled and not advisor */}
            {isEnrolled && !isAdvisor ? (
                <form onSubmit={handleAddQuestion} className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ask a Question</h3>
                    <div className="flex gap-4">
                        <textarea
                            rows={2}
                            placeholder="Type your question here..."
                            className="flex-1 rounded-xl border-gray-200 focus:ring-2 focus:ring-cyan-300 focus:border-indigo-400 border px-4 py-3 text-sm resize-none"
                            value={questionText}
                            onChange={e => setQuestionText(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={questionLoading || !questionText.trim()}
                            className={`px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${questionLoading || !questionText.trim()
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600'
                                }`}
                        >
                            {questionLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            ) : isAdvisor ? (
                <div className="border-t border-gray-200 pt-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-700">
                            <strong>As the course advisor</strong>, you can view and answer questions from students.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="border-t border-gray-200 pt-6">
                    <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-amber-700">
                            <strong>Enroll in this course</strong> to ask questions and get help from the instructor.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

/* Add styles for the custom scrollbar */
const styleTag = document.createElement('style');
styleTag.innerHTML = `
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #4F46E5, #22D3EE);
    border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #4338ca;
}
`;
typeof document !== 'undefined' && document.head.appendChild(styleTag);

export default QASection;
