const mongoose = require('mongoose');

const CourseQASchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    question: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },

    answer: {
        text: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        answeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        answeredAt: Date
    },

    status: {
        type: String,
        enum: ['pending', 'answered'],
        default: 'pending'
    },

    upvotes: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

CourseQASchema.index({ courseId: 1, status: 1 });
CourseQASchema.index({ studentId: 1 });

const CourseQA = mongoose.model('CourseQA', CourseQASchema);

module.exports = CourseQA;
