//const usermodel = require("../models/users.model");
const userservice = require("../services/user.service");
//const authmiddleware = require("../middlewares/auth.middleware");
const BlacklistTokenService = require("../services/blacklisttoken.service");
// Register a new user
const courseService = require('../services/course.service');
const otpService = require('../services/otp.service');
const { cloudinary } = require('../config/cloudinary');
exports.registerUser = async (req, res) => {

    const { fullname, email, password, phone } = req.body;
    if (!fullname || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userservice.createuser({ fullname, email, password, phone });
    if (user) {
        const token = user.generateAuthToken();
        return res.status(201).json({ message: "User registered successfully", user, token: token });
    }
}
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await userservice.loginUser({ email, password });
        if (user) {
            const token = user.generateAuthToken();

            // Set HttpOnly cookie
            res.cookie('token', token, {
                httpOnly: true,        // Prevents XSS attacks
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'strict',    // CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                path: '/'              // Cookie available on all paths
            });

            // Don't send token in response body for security
            return res.status(200).json({
                message: "User logged in successfully",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    phone: user.phone,

                },
                token: token
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getOtherUserProfile = async (req, res) => {
    const { userId } = req.params;
    const user = req.user;



    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    const userProfile = await userservice.getUserProfile(userId);
    if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
    }
    if (user && user._id.toString() === userId) {
        const yourProfile = {
            ...userProfile,
            other: false // Indicating this is the user's own profile
        }
        return res.status(200).json({ message: "User profile retrieved successfully", yourProfile });
    }
    const OtherUserProfile = {
        ...userProfile,
        other: true // Indicating this is a profile of another user

    }
    return res.status(200).json({ message: "User profile retrieved successfully", OtherUserProfile });
}
exports.logout = async (req, res) => {
    try {
        const token = req.token;
        const blt = await BlacklistTokenService.addTokenToBlacklist(token);
        if (!blt) {
            return res.status(500).json({ message: "Failed to log out" });
        }

        // Clear the HttpOnly cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        req.user = null;
        req.token = null;

        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { fullname, bio, profilePhoto, phone } = req.body;

        // Validate required fields
        if (!fullname || !fullname.firstname || !fullname.lastname) {
            return res.status(400).json({
                message: "First name and last name are required"
            });
        }

        const updateData = {
            fullname,
            bio,
            profilePhoto,
            phone
        };

        const updatedUser = await userservice.updateUserProfile(user._id, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: "Failed to update profile" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePhoto: updatedUser.profilePhoto,
                phone: updatedUser.phone
            }
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Failed to update profile"
        });
    }
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

exports.getUsersByName = async (req, res) => {
    try {
        const { name } = req.query; // Get search name from query parameters

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: "Search name is required" });
        }

        const users = await userservice.getUsersByName(name.trim());

        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "No users found with the specified name",
                searchTerm: name
            });
        }

        return res.status(200).json({
            message: "Users retrieved successfully",
            count: users.length,
            searchTerm: name,
            users
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to search users by name",
            error: error.message
        });
    }
}
exports.getUserHistory = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const history = await userservice.getUserHistory(user._id);
    if (!history || history.length === 0) {
        return res.status(404).json({ message: "No history found for this user" });
    }
    return res.status(200).json({ message: "User history retrieved successfully", history });
}

exports.getMyEnrollments = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const enrollments = await userservice.getUserEnrollments(user._id);
        const stats = await userservice.getEnrollmentStats(user._id);

        if (!enrollments || enrollments.length === 0) {
            return res.status(200).json({
                message: "No enrollments found for this user",
                enrollments: [],
                stats: {
                    totalCourses: 0,
                    inProgress: 0,
                    completed: 0,
                    totalHours: 0,
                    actualHoursSpent: 0
                }
            });
        }

        return res.status(200).json({
            message: "User enrollments retrieved successfully",
            enrollments,
            stats
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve enrollments",
            error: error.message
        });
    }
}

// Add endpoint to update progress
exports.updateCourseProgress = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const { courseId, moduleId, timeSpent } = req.body;

        if (!courseId || !moduleId) {
            return res.status(400).json({
                message: "Course ID and Module ID are required"
            });
        }

        const progressRecord = await userservice.updateCourseProgress(
            user._id,
            courseId,
            moduleId,
            timeSpent || 0
        );

        return res.status(200).json({
            message: "Progress updated successfully",
            progress: progressRecord.progressPercentage,
            isCompleted: progressRecord.isCompleted,
            totalTimeSpent: progressRecord.totalTimeSpent
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update progress",
            error: error.message
        });
    }
};

exports.followUser = async (req, res) => {
    const user = req.user;
    const { followId } = req.params;
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!followId) {
        return res.status(400).json({ message: "Follow ID is required" });
    }
    if (user._id.toString() === followId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }
    try {
        const updatedUser = await userservice.followUser(user._id, followId);
        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to follow user" });
        }
        return res.status(200).json({ message: "User followed successfully", updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Failed to follow user", error: error.message });
    }
}

exports.unfollowUser = async (req, res) => {
    const user = req.user;
    const { unfollowId } = req.params;
    if (!user) {
        return res.status(404).json({ message: "User not found" });

    }
    if (!unfollowId) {
        return res.status(400).json({ message: "Unfollow ID is required" });
    }

    if (user._id.toString() === unfollowId) {
        return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    try {
        const updatedUser = await userservice.unfollowUser(user._id, unfollowId);
        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to unfollow user" });
        }
        return res.status(200).json({ message: "User unfollowed successfully", updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Failed to unfollow user", error: error.message });
    }
}

// Check if user is authenticated (for persistent login)


exports.mycard = async (req, res) => {

    const user = req.user;
    if (!user) {
        res.status(200).json({ message: "you are not login", isLogin: false });
    }

    try {
        const usercard = await userservice.mycard(user._id);
        res.status(200).json({ message: "hello", usercard, isLogin: true });
    } catch (error) {

        res.status(400).json({ message: error.message });
    }
}

exports.uploadProfilePhoto = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded. Please select an image file." });
        }

        const profilePhotoUrl = req.file.path;

        // Delete old profile photo from Cloudinary if exists
        if (user.profilePhoto && user.profilePhoto.includes('cloudinary.com')) {
            try {
                // Extract public_id from URL
                const urlParts = user.profilePhoto.split('/');
                const publicIdWithExt = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExt.split('.')[0];
                const fullPublicId = `skill-exchange/profile-photos/${publicId}`;

                await cloudinary.uploader.destroy(fullPublicId);
            } catch (deleteError) {
                // Error deleting old profile photo (non-critical)
            }
        }

        // Update user profile photo in database
        const updatedUser = await userservice.updateUserProfile(user._id, {
            profilePhoto: profilePhotoUrl
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "Failed to update profile photo in database" });
        }

        return res.status(200).json({
            message: "Profile photo updated successfully",
            profilePhoto: profilePhotoUrl,
            user: {
                _id: updatedUser._id,
                profilePhoto: updatedUser.profilePhoto
            }
        });
    } catch (error) {
        // Handle specific multer errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
        }

        if (error.message.includes('Only image files are allowed')) {
            return res.status(400).json({ message: "Only image files are allowed." });
        }

        return res.status(500).json({
            message: "Failed to upload profile photo",
            error: error.message
        });
    }
};