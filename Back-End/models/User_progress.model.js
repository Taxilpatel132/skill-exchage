const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedModules: [{
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module',
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        timeSpent: {
            type: Number, // in minutes
            default: 0
        }
    }],
    totalModules: {
        type: Number,
        required: true,
        default: 0
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    totalTimeSpent: {
        type: Number, // in minutes
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure one progress record per user per course
UserProgressSchema.index({ user: 1, course: 1 }, { unique: true });

// Method to calculate progress percentage
UserProgressSchema.methods.calculateProgress = function () {
    if (this.totalModules === 0) {
        this.progressPercentage = 0;
    } else {
        this.progressPercentage = Math.round((this.completedModules.length / this.totalModules) * 100);
    }

    // Mark as completed if 100% progress
    if (this.progressPercentage === 100 && !this.isCompleted) {
        this.isCompleted = true;
        this.completedAt = new Date();
    }

    return this.progressPercentage;
};

// Method to add completed module
UserProgressSchema.methods.addCompletedModule = function (moduleId, timeSpent = 0) {
    // Check if module is already completed
    const existingModule = this.completedModules.find(
        module => module.moduleId.toString() === moduleId.toString()
    );

    if (!existingModule) {
        this.completedModules.push({
            moduleId,
            timeSpent,
            completedAt: new Date()
        });

        // Update total time spent
        this.totalTimeSpent += timeSpent;

        // Recalculate progress
        this.calculateProgress();

        // Update last accessed
        this.lastAccessedAt = new Date();
    }

    return this;
};

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
module.exports = UserProgress;
