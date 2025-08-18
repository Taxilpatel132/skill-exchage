const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who will receive
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: who triggered it
    type: {
        type: String,
        enum: ["new_course", "new_message"],
        required: true
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // for new_course type
    message: { type: String }, // optional custom message
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }

});
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;