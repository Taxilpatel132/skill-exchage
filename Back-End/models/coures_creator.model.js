const mongoose = require('mongoose');

const UserCoursesSchema = new mongoose.Schema({
    userId: {
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
});

const UserCourses = mongoose.model('UserCourses', UserCoursesSchema);

module.exports = UserCourses;
