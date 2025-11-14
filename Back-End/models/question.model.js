const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        text: {
            type: String,
            trim: true
        },
        answeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        answeredAt: {
            type: Date
        }
    },
    votes: {
        type: Number,
        default: 0
    },
    isAnswered: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Question", questionSchema);
