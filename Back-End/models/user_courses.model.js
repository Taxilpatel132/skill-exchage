const mongoose = require('mongoose');

const UserCoursesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course', // Reference to the Course model
        },
    ],
});

const UserCourses = mongoose.model('UserCourses', UserCoursesSchema);

module.exports = UserCourses;
