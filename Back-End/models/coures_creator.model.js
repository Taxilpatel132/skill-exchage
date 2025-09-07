const mongoose = require('mongoose');

const UserCoursesSchema = new mongoose.Schema({
    advisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        },
    ],
    avgRating: {
        type: Number,
        default: 0,
    },
    // Simple analytics
    totalStudents: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        maxlength: 500,
        trim: true
    },
    experience: {
        type: String,
        default: "New Instructor"
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const UserCourses = mongoose.model('UserCourses', UserCoursesSchema);

module.exports = UserCourses;