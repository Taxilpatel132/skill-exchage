const Notification = require('../models/notification.model');
const User = require('../models/users.model');
const courseModel = require('../models/course.model');

// Get user notifications with pagination
exports.getUserNotifications = async (userId, options = {}) => {
    try {
        const { page = 1, limit = 10, type } = options;
        const skip = (page - 1) * limit;
        
        // Build query
        const query = { receiver: userId };
        if (type) {
            query.type = type;
        }
        
        // Get notifications with populated sender and course data
        const notifications = await Notification.find(query)
            .populate('sender', 'fullname username profilePhoto profilePicture')
            .populate('course', 'title thumbnail')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        // Get total count for pagination
        const totalNotifications = await Notification.countDocuments(query);
        const totalPages = Math.ceil(totalNotifications / limit);
        
        return {
            notifications,
            currentPage: page,
            totalPages,
            totalNotifications,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    } catch (error) {
        throw new Error(`Failed to get user notifications: ${error.message}`);
    }
};

// Mark notification as read
exports.markAsRead = async (userId, notificationId) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, receiver: userId },
            { isRead: true },
            { new: true }
        ).populate('sender', 'fullname username profilePhoto profilePicture')
         .populate('course', 'title thumbnail');
        
        return notification;
    } catch (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (userId) => {
    try {
        const result = await Notification.updateMany(
            { receiver: userId, isRead: false },
            { isRead: true }
        );
        
        return { updatedCount: result.modifiedCount };
    } catch (error) {
        throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
};

// Delete notification
exports.deleteNotification = async (userId, notificationId) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            receiver: userId
        });
        
        return notification;
    } catch (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
    }
};

// Get unread notification count
exports.getUnreadCount = async (userId) => {
    try {
        const count = await Notification.countDocuments({
            receiver: userId,
            isRead: false
        });
        
        return count;
    } catch (error) {
        throw new Error(`Failed to get unread count: ${error.message}`);
    }
};

// Create and emit real-time notification
exports.createAndEmitNotification = async (notificationData, io) => {
    try {
        const { receiverId, senderId, type, courseId, message } = notificationData;
        
        // Create notification in database
        const notification = new Notification({
            receiver: receiverId,
            sender: senderId,
            type,
            course: courseId,
            message
        });
        
        const savedNotification = await notification.save();
        
        // Populate the notification for real-time emission
        const populatedNotification = await Notification.findById(savedNotification._id)
            .populate('sender', 'fullname username profilePhoto profilePicture')
            .populate('course', 'title thumbnail');
        
        // Emit to specific user
        if (io) {
            io.to(`user_${receiverId}`).emit('new_notification', {
                notification: populatedNotification,
                type: 'new_notification'
            });
            
            // Also emit to course room if it's a course-related notification
            if (courseId) {
                io.to(`course_${courseId}`).emit('course_notification', {
                    notification: populatedNotification,
                    type: 'course_notification'
                });
            }
        }
        
        return populatedNotification;
    } catch (error) {
        throw new Error(`Failed to create and emit notification: ${error.message}`);
    }
};

// Emit notification to multiple users (for followers)
exports.emitToMultipleUsers = async (userIds, notificationData, io) => {
    try {
        const notifications = [];
        
        for (const userId of userIds) {
            const notification = await this.createAndEmitNotification({
                ...notificationData,
                receiverId: userId
            }, io);
            notifications.push(notification);
        }
        
        return notifications;
    } catch (error) {
        throw new Error(`Failed to emit to multiple users: ${error.message}`);
    }
};
