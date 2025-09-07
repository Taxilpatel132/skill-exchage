const mongoose = require("mongoose");

const userEnrollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }],

}, {
    timestamps: true
});

// Compound index to ensure a user can only enroll once per course
userEnrollSchema.index({ user: 1, courses: 1 }, { unique: true });

const UserEnroll = mongoose.model("UserEnroll", userEnrollSchema);

module.exports = UserEnroll;