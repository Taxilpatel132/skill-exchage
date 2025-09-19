import React from 'react';
import StarRating from './StarRating';

const ReviewsSection = ({
    reviews,
    reviewForm,
    setReviewForm,
    handleAddReview,
    reviewLoading,
    isEnrolled,
    myReview,
    currentUserId
}) => {
    return (
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-6 mb-10">
                {reviews.length > 0 ? (
                    reviews.map((r, index) => {
                        const isMyReview = r.userId === currentUserId;
                        return (
                            <div
                                key={r.id}
                                className={`border-b border-gray-100 pb-6 last:border-b-0 ${isMyReview ? 'bg-gradient-to-r from-indigo-50 to-cyan-50 p-4 rounded-xl border-l-4 border-indigo-500' : ''
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-md ${isMyReview
                                        ? 'bg-gradient-to-br from-indigo-600 to-cyan-500'
                                        : 'bg-gradient-to-br from-indigo-500 to-cyan-400'
                                        }`}>
                                        {r.name[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`font-semibold ${isMyReview ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                {isMyReview ? `${r.name} (You)` : r.name}
                                            </span>
                                            <StarRating value={r.rating} size={14} />
                                            {r.createdAt && (
                                                <span className="text-xs text-gray-500">
                                                    {new Date(r.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`leading-relaxed ${isMyReview ? 'text-indigo-800' : 'text-gray-700'}`}>
                                            {r.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {/* Add Review Form - Only show if enrolled */}
            {isEnrolled ? (
                <form onSubmit={handleAddReview} className="space-y-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">
                        {myReview ? 'Update Your Review' : 'Add Your Review'}
                    </h3>

                    {/* Show form only if no review exists or allow updating existing review */}
                    {!myReview && (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Your name (optional)"
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
                                required
                            />
                            <button
                                type="submit"
                                disabled={reviewLoading || !reviewForm.rating || !reviewForm.text}
                                className={`px-6 py-3 rounded-lg text-white text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg ${reviewLoading || !reviewForm.rating || !reviewForm.text
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600'
                                    }`}
                            >
                                {reviewLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </>
                    )}

                    {/* Show message if user already has a review */}
                    {myReview && (
                        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-700 font-semibold">You have already reviewed this course</p>
                            </div>
                            <p className="text-green-600 text-sm">
                                Your review appears at the top of the list with special highlighting. Thank you for your feedback!
                            </p>
                        </div>
                    )}
                </form>
            ) : (
                <div className="pt-6 border-t border-gray-200">
                    <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-amber-700">
                            <strong>Enroll in this course</strong> to leave a review and share your experience with other students.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ReviewsSection;
