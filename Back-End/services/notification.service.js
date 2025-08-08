const notificationsModel = require("../models/notifications.model");
const usermodel = require("../models/users.model");


module.exports.createNotificationOncreatecourse = async (notificationData) => {
    const { userId, message, type } = notificationData;
    const followersList = await usermodel.findById(userId).populate('followers');
    if (!followersList || followersList.followers.length === 0) {
        throw new Error("No followers found for the user");
    }


    if (!userId || !message || !type) {
        throw new Error("User ID, message, and type are required");
    }

    const notificationList = followersList.followers.map(follower => {
        return {
            receiver: follower._id,
            sender: userId,
            type,
            message
        };
    });

    return await notificationsModel.insertMany(notificationList);
}


module.exports.receiverNotification = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const notifications = await notificationsModel.find({ receiver: userId });
    return notifications;
}


module.exports.markNotificationAsRead = async (notificationId) => {
    if (!notificationId) {
        throw new Error("Notification ID is required");
    }
    const notification = await notificationsModel.findById(notificationId);
    if (!notification) {
        throw new Error("Notification not found");
    }
    notification.isRead = true;
    await notification.save();
    return notification;
}