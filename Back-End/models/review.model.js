const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
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
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate reviews from same user for same course
ReviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// Index for faster queries
ReviewSchema.index({ courseId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });

// Update the updatedAt field before saving
ReviewSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;