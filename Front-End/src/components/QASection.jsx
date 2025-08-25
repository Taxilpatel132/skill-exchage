import React from 'react';

const QASection = ({ qa, questionText, setQuestionText, handleAddQuestion }) => {
    return (
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions & Answers</h2>

            {/* Q&A List with Fixed Height and Scroll */}
            <div className="mb-8 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-6">
                    {qa.map(q => (
                        <div key={q.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-indigo-200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                    {q.asker[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">{q.asker}</span>
                                        <span className="text-sm text-gray-500">asks:</span>
                                    </div>
                                    <p className="text-gray-800 font-medium">{q.question}</p>
                                </div>
                            </div>

                            <div className="ml-16 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-4 border-l-4 border-indigo-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                                    <span className="text-sm font-semibold text-indigo-600">Advisor Response:</span>
                                </div>
                                <p className="text-gray-800">{q.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ask Question Form */}
            <form onSubmit={handleAddQuestion} className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ask a Question</h3>
                <div className="flex gap-4">
                    <textarea
                        rows={2}
                        placeholder="Type your question here..."
                        className="flex-1 rounded-xl border-gray-200 focus:ring-2 focus:ring-cyan-300 focus:border-indigo-400 border px-4 py-3 text-sm resize-none"
                        value={questionText}
                        onChange={e => setQuestionText(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ background: 'linear-gradient(90deg,#4F46E5,#22D3EE)' }}
                    >
                        Submit
                    </button>
                </div>
            </form>
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
