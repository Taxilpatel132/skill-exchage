const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import your models
const User = require('./models/users.model');
const Course = require('./models/course.model');
const Module = require('./models/module.model');
const Notification = require('./models/notification.model');
const Review = require('./models/review.model');

const backupDir = path.join(__dirname, '..', 'db-backup');

async function exportData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected!\n');

        // Create backup directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Export Users
        console.log('📦 Exporting users...');
        const users = await User.find({}).select('-password').lean();
        fs.writeFileSync(
            path.join(backupDir, 'users.json'),
            JSON.stringify(users, null, 2)
        );
        console.log(`✅ Exported ${users.length} users`);

        // Export Courses
        console.log('📦 Exporting courses...');
        const courses = await Course.find({}).lean();
        fs.writeFileSync(
            path.join(backupDir, 'courses.json'),
            JSON.stringify(courses, null, 2)
        );
        console.log(`✅ Exported ${courses.length} courses`);

        // Export Modules
        console.log('📦 Exporting modules...');
        const modules = await Module.find({}).lean();
        fs.writeFileSync(
            path.join(backupDir, 'modules.json'),
            JSON.stringify(modules, null, 2)
        );
        console.log(`✅ Exported ${modules.length} modules`);

        // Export Notifications
        console.log('📦 Exporting notifications...');
        const notifications = await Notification.find({}).lean();
        fs.writeFileSync(
            path.join(backupDir, 'notifications.json'),
            JSON.stringify(notifications, null, 2)
        );
        console.log(`✅ Exported ${notifications.length} notifications`);

        // Export Reviews
        console.log('📦 Exporting reviews...');
        const reviews = await Review.find({}).lean();
        fs.writeFileSync(
            path.join(backupDir, 'reviews.json'),
            JSON.stringify(reviews, null, 2)
        );
        console.log(`✅ Exported ${reviews.length} reviews`);

        console.log('\n🎉 Backup completed successfully!');
        console.log(`📁 Files saved to: ${backupDir}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during backup:', error.message);
        process.exit(1);
    }
}

exportData();
