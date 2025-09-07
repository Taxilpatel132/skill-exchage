const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
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
    videoUrl: String,
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ["pdf", "video", "quiz", "link"],
            default: "link"
        }
    }]
});

const CourseDetailsSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true
    },

    // Course Structure
    modules: [ModuleSchema],

    // Basic Course Info
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true
    },

    duration: {
        totalHours: {
            type: Number,
            required: true
        },
        weeks: {
            type: Number,
            required: true
        }
    },

    // Learning Outcomes
    learningOutcomes: [{
        type: String,
        required: true,
        trim: true
    }],

    prerequisites: [{
        type: String,
        trim: true
    }],

    // Course Features (simplified)
    hasCertificate: {
        type: Boolean,
        default: true
    },

    language: {
        type: String,
        default: 'English'
    },

    // Basic Stats
    totalEnrollments: {
        type: Number,
        default: 0
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

// Simple virtuals
CourseDetailsSchema.virtual('totalModules').get(function () {
    return this.modules.length;
});

const CourseDetails = mongoose.model('CourseDetails', CourseDetailsSchema);

module.exports = CourseDetails;
