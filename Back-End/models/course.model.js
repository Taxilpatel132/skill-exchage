// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },

    advisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    priceInPoints: {
        type: Number,
        default: 10
    },
    tags: [String],
    thumbnail: {
        type: String,
        required: true,
    },


    sessionDetails: {
        date: Date,
        startTime: String,
        endTime: String,
        duration: Number
    },


    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },


    enrolledUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],


    status: {
        type: String,
        enum: ["coming_soon", "on_going", "complete", "blocked"],
        default: "coming_soon"
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    fileResources: [{
        url: String,
        filename: String, // optional, useful for displaying
        type: {
            type: String,
            enum: ["pdf", "video", "ppt", "docx", "other"],
            default: "other"
        }
    }],
});

const cousre = mongoose.model("Course", courseSchema);
module.exports = cousre;