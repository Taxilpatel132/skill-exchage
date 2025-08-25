import React from 'react';
import StarRating from './StarRating';

const ReviewsSection = ({ reviews, reviewForm, setReviewForm, handleAddReview }) => {
    return (
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">{reviews.length} reviews</span>
            </div>

            <div className="space-y-6 mb-10">
                {reviews.map(r => (
                    <div key={r.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                {r.name[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-gray-900">{r.name}</span>
                                    <StarRating value={r.rating} size={14} />
                                </div>
                                <p className="text-gray-700 leading-relaxed">{r.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="space-y-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Add Your Review</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Your name"
                        className="rounded-lg border-gray-200 focus:ring-2 focus:ring-cyan-300 focus:border-indigo-400 border px-4 py-3 text-sm font-medium"
                        value={reviewForm.name}
                        onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    />
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Rating:</span>
                        <StarRating
                            value={reviewForm.rating}
                            interactive
                            onChange={(v) => setReviewForm(f => ({ ...f, rating: v }))}
                        />
                    </div>
                </div>
                <textarea
                    rows={4}
                    placeholder="Share your experience..."
                    className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-cyan-300 focus:border-indigo-400 border px-4 py-3 text-sm resize-y"
                    value={reviewForm.text}
                    onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                />
                <button
                    type="submit"
                    className="px-6 py-3 rounded-lg text-white text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
                    style={{ background: 'linear-gradient(90deg,#4F46E5,#22D3EE)' }}
                >
                    Submit Review
                </button>
            </form>
        </section>
    );
};

export default ReviewsSection;
