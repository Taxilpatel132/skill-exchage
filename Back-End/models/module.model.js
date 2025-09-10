const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String, // e.g., "2 hours"
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    videoUrl: {
        type: String,
        default: ''
    },
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ["pdf", "video", "quiz", "link"],
            default: "link"
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
ModuleSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Index for faster queries
ModuleSchema.index({ courseId: 1, order: 1 });

const Module = mongoose.model("Module", ModuleSchema);
module.exports = Module;