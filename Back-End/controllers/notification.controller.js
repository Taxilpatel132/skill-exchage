const notificationService = require('../services/notification.service');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10, type } = req.query;
        
        const notifications = await notificationService.getUserNotifications(userId, {
            page: parseInt(page),
            limit: parseInt(limit),
            type
        });
        
        res.status(200).json({
            success: true,
            notifications: notifications.notifications,
            pagination: {
                currentPage: notifications.currentPage,
                totalPages: notifications.totalPages,
                totalNotifications: notifications.totalNotifications,
                hasNext: notifications.hasNext,
                hasPrev: notifications.hasPrev
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { notificationId } = req.params;
        
        const notification = await notificationService.markAsRead(userId, notificationId);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const result = await notificationService.markAllAsRead(userId);
        
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            updatedCount: result.updatedCount
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const { notificationId } = req.params;
        
        const result = await notificationService.deleteNotification(userId, notificationId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const count = await notificationService.getUnreadCount(userId);
        
        res.status(200).json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
