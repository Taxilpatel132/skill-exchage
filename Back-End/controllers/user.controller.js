//const usermodel = require("../models/users.model");
const userservice = require("../services/user.service");
//const authmiddleware = require("../middlewares/auth.middleware");
const BlacklistTokenService = require("../services/blacklisttoken.service");
// Register a new user
const courseService = require('../services/course.service');
const otpService = require('../services/otp.service');
exports.registerUser = async (req, res) => {

    const { fullname, email, password, phone } = req.body;
    if (!fullname || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }



    const user = await userservice.createuser({ fullname, email, password, phone });
    if (user) {

        return res.status(201).json({ message: "User registered successfully", user });
    }
}
exports.loginUser = async (req, res) => {
    console.log("from login user", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email and password are require" });
    }
    const user = await userservice.loginUser({ email, password });
    if (user) {
        const token = user.generateAuthToken();
        //res.header("Authorization", `Bearer ${token}`);
        //console.log("from login user", req.headers);
        return res.status(200).json({ message: "User logged in successfully", user, token });
    }
}
exports.getuserProfile = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User profile retrieved successfully", user });
}
exports.logout = async (req, res) => {
    token = req.token;
    const blt = await BlacklistTokenService.addTokenToBlacklist(token);
    if (!blt) {
        return res.status(500).json({ message: "Failed to log out" });
    }
    req.user = null;
    req.token = null;

    return res.status(200).json({ message: "User logged out successfully" });
}

exports.updateUserProfile = async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(404).json({ message: "User not found" });
    }
    const data = req.body;
    // const profilePicture = data.profilePicture;
    const Skills = [...user.Skills, data.Skills];
    const Education = data.Education;
    const updatedUser = await userservice.updateUserProfile(user._id, { Skills, Education });
    if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user profile" });
    }
    return res.status(200).json({ message: "User profile updated successfully", user: updatedUser });


}

exports.blockedCourse = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const { courseId } = req.body;
    if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
    }
    const course = await courseService.getCourseById(courseId);
    if (user._id != course.advisor._id) {
        return res.status(401).json({ message: "user can't bolcked this course" })
    }
    const updatedCourse = await courseService.updatetoBlacked(courseId);
    return res.status(200).json({ message: "course is updated to block", updatedCourse });
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const user = await userservice.findByEmail(email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const respond = await otpService.generateAndSendOTP(email);
    if (!respond) {
        return res.status(400).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "OTP sent to your email" });
}

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
        const respond = await otpService.verifyOTP(email, otp, 'user');
        if (!respond) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        // Store token in session or return it to frontend
        return res.status(200).json({
            message: "OTP verified successfully",
            resetToken: respond.token
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.createNewPassword = async (req, res) => {
    const { password, confirmPassword, resetToken } = req.body;

    if (!resetToken) {
        return res.status(401).json({ message: "Reset token is required" });
    }

    if (!password || !confirmPassword) {
        return res.status(400).json({ message: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const rawToken = resetToken.replace(/^"|"$/g, '');
        const respond = await userservice.updatePassword({ password, token: rawToken });
        if (!respond) {
            return res.status(400).json({ message: "Failed to update password" });
        }
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}