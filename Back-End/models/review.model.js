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
        trim: true
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews from same user for same course
ReviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;