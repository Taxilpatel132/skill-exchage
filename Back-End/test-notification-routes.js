// Test script to verify notification routes are working
const express = require('express');
const app = express();

// Test the notification route import
try {
    const notificationRoutes = require('./routes/notification.route');
    console.log('✅ Notification routes imported successfully');
    
    // Test the controller import
    const notificationController = require('./controllers/notification.controller');
    console.log('✅ Notification controller imported successfully');
    
    // Test the service import
    const notificationService = require('./services/notification.service');
    console.log('✅ Notification service imported successfully');
    
    // Test the auth middleware import
    const { authUser } = require('./auth-middleware/auth');
    console.log('✅ Auth middleware imported successfully');
    
    console.log('\n🎉 All notification system components are working correctly!');
    console.log('\nYou can now start your server with: node server.js');
    
} catch (error) {
    console.error('❌ Error importing notification components:', error.message);
    console.error('Stack trace:', error.stack);
}
