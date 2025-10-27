//const otpService = require("../services/otp.service");
const adminService = require("../services/admin.service");
const adminModel = require("../models/admin.model");
const BlacklistTokenService = require("../services/blacklisttoken.service");
const courseService = require("../services/course.service");
const usermodel = require('../models/users.model');
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {

        const otpData = await adminService.sendOtp(email);
        if (!otpData) {
            return res.status(500).json({ message: "Failed to send OTP" });
        }


        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
        const isValid = await adminService.verifyOtp(email, otp);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        res.status(200).json({ message: "OTP verified successfully", token: isValid.token });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.logout = async (req, res) => {
    try {
        const token = req.token; // Assuming token is set in auth middleware
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }
        const blt = await BlacklistTokenService.addTokenToBlacklist(token);
        if (!blt) {
            return res.status(500).json({ message: "Failed to log out" });
        }


        req.admin = null;
        req.token = null;
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.blockCourse = async (req, res) => {
    const admin = req.admin;
    if (!admin) {
        return res.status(404).json({ message: "admin is not found" });
    }
    const { courseId } = req.body;
    if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
    }
    const course = await courseService.updatetoBlacked(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found or already blocked" });
    }
    res.status(200).json({ message: "Course blocked successfully", course });
}

module.exports.blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await usermodel.findByIdAndUpdate(
            userId,
            { status: 'blocked' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User blocked successfully',
            user
        });
    } catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to block user'
        });
    }
};

module.exports.unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await usermodel.findByIdAndUpdate(
            userId,
            { status: 'active' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User unblocked successfully',
            user
        });
    } catch (error) {
        console.error('Unblock user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unblock user'
        });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await usermodel.find().select('-password');

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

module.exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await usermodel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};

module.exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const users = await usermodel.find({
            $or: [
                { 'fullname.firstname': { $regex: query, $options: 'i' } },
                { 'fullname.lastname': { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Admin search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search users'
        });
    }
};

module.exports.searchCourses = async (req, res) => {
    try {
        const { category } = req.query;
        const courseModel = require('../models/course.model');

        let query = {};
        if (category) {
            query.category = category;
        }

        const courses = await courseModel.find(query).populate('instructor', 'fullname email');

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });
    } catch (error) {
        console.error('Admin search courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search courses'
        });
    }
};