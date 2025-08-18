//const otpService = require("../services/otp.service");
const adminService = require("../services/admin.service");
const adminModel = require("../models/admin.model");
const BlacklistTokenService = require("../services/blacklisttoken.service");
const courseService = require("../services/course.service");
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