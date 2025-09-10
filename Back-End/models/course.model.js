// models/Course.js

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    // Basic course information (used in CourseDetails page)
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    duration: {
        type: String, // e.g., "8 Weeks • ~60 hrs"
        required: true
    },
    priceInPoints: {
        type: Number,
        required: true,
        min: 1
    },
    thumbnail: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Advanced"]
    },
    certificate: {
        type: Boolean,
        default: true
    },
    language: {
        type: String,
        default: "English"
    },
    category: {
        type: String,
        required: true,
        enum: ["Programming", "Design", "Marketing", "Business", "Other"]
    },

    // Course content (reference to Module collection)
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],

    // Course reviews (reference to Review collection)
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],    // Course metadata
    advisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Course statistics (used in CourseDetails page)
    enrollmentCount: {
        type: Number,
        default: 0,
        alias: 'students' // For frontend compatibility
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    totalRatings: {
        type: Number,
        default: 0
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    // Course status
    status: {
        type: String,
        enum: ["active", "blocked", "draft"],
        default: "active"
    }
});

// Virtual properties
courseSchema.virtual('totalModules').get(function () {
    return this.modules.length;
});

courseSchema.virtual('totalReviews').get(function () {
    return this.reviews.length;
});

courseSchema.virtual('latestReviews').get(function () {
    return this.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
});

// Virtual for lastUpdated (used in CourseDetails page)
courseSchema.virtual('lastUpdated').get(function () {
    return this.updatedAt.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
});

// Virtual for students (alias for enrollmentCount)
courseSchema.virtual('students').get(function () {
    return this.enrollmentCount;
});

// Update the updatedAt field before saving
courseSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Method to add a module reference
courseSchema.methods.addModule = function (moduleId) {
    if (!this.modules.includes(moduleId)) {
        this.modules.push(moduleId);
    }
    return this.save();
};

// Method to add a review reference
courseSchema.methods.addReview = function (reviewId) {
    if (!this.reviews.includes(reviewId)) {
        this.reviews.push(reviewId);
    }
    return this.save();
};

// Method to remove a review reference
courseSchema.methods.removeReview = function (reviewId) {
    this.reviews = this.reviews.filter(id => !id.equals(reviewId));
    return this.save();
};

const course = mongoose.model("Course", courseSchema);
module.exports = course;