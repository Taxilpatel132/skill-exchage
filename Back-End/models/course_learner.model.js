const mongoose = require('mongoose');


const UserCourseHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    enrollmentDate: {
        type: Date,
        default: Date.now,
    },

    progress: {
        type: Number,
        default: 0,
    },
});

const UserCourseHistory = mongoose.model('UserCourseHistory', UserCourseHistorySchema);

module.exports = UserCourseHistory;