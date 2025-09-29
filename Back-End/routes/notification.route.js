const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authUser } = require('../auth-middleware/auth');

// Get user notifications
router.get('/', authUser, notificationController.getUserNotifications);

// Mark notification as read
router.patch('/:notificationId/read', authUser, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', authUser, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', authUser, notificationController.deleteNotification);

// Get unread notification count
router.get('/unread-count', authUser, notificationController.getUnreadCount);

module.exports = router;
