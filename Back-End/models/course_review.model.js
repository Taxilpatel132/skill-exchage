const mongoose = require('mongoose');

const CourseReviewSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    review: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },

    // Simple helpful tracking
    helpfulCount: {
        type: Number,
        default: 0
    },

    isVerified: {
        type: Boolean,
        default: false // Based on course completion
    }

}, {
    timestamps: true
});

// Prevent duplicate reviews
CourseReviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });
CourseReviewSchema.index({ courseId: 1, rating: -1 });

const CourseReview = mongoose.model('CourseReview', CourseReviewSchema);

module.exports = CourseReview;
