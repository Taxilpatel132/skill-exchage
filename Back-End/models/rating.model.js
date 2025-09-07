// models/Rating.js
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    },
    // Simple helpful tracking for reviews
    helpfulCount: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false // Based on course completion
    }
}, {
    timestamps: true // This will add createdAt and updatedAt automatically
});

// Prevent duplicate reviews from same user for same course
ratingSchema.index({ course: 1, user: 1 }, { unique: true });
ratingSchema.index({ course: 1, stars: -1 });
ratingSchema.index({ course: 1, createdAt: -1 });

module.exports = mongoose.model("Rating", ratingSchema);
module.exports = mongoose.model("Rating", ratingSchema);
