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
});

const UserCourses = mongoose.model('UserCourses', UserCoursesSchema);

module.exports = UserCourses;