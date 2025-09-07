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
    priceInPoints: {
        type: Number,
        default: 10
    },
    categories: {
        type: String,
        required: true,
        enum: ["Programming", "Design", "Marketing", "Business", "Other"]
    },
    tags: {
        type: [String],
        required: true
    },
    advisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active"
    },
    thumbnail: {
        type: String,
        required: true,
        match: /\.(jpeg|jpg|gif|png)$/
    },


    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },

    // Simplified stats
    enrollmentCount: {
        type: Number,
        default: 0
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

const course = mongoose.model("Course", courseSchema);
module.exports = course;