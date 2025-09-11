const usermodel = require("../models/users.model");
const courseCreator = require("../models/coures_creator.model");
const courseService = require("../services/course.service");

const NotificationService = require("../services/notification.service");
const UserEnroll = require("../models/User_enroll.model");
exports.createuser = async (userData) => {
    const { fullname, email, password, phone } = userData;
    if (!fullname || !email || !password || !phone) {
        throw new Error("something is wrong");
    }
    // console.log(userData);
    const UserExist = await usermodel.findOne({ email });
    // console.log()
    if (UserExist) {
        throw new Error("User already exists");
    }
    const hashpassword = await usermodel.hashPassword(password);
    const User = new usermodel({
        fullname, password: hashpassword, email, phone,
    })
    const savedUser = await User.save();
    return savedUser;
}
exports.loginUser = async (userData) => {
    const { email, password } = userData;
    if (!email || !password) {
        throw new Error("email and password are require");
    }
    console.log(email, password);
    const user = await usermodel.findOne({ email: email });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    //const token = user.generateAuthToken();
    return user;
}
exports.findByEmail = async (email) => {
    if (!email) {
        throw new Error("Email is required");
    }
    const user = await usermodel.findOne({ email: email });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

exports.updatePassword = async (passData) => {
    const { password, token } = passData;

    if (!password || !token) {
        throw new Error("Password and token are required");
    }

    try {
        // Verify the token and extract user ID
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded._id;

        const hashpassword = await usermodel.hashpassword(password);
        const updatedUser = await usermodel.findByIdAndUpdate(
            userId,
            { password: hashpassword },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("Failed to update password");
        }
        return updatedUser;
    } catch (error) {
        throw new Error("Invalid or expired reset token");
    }
}

exports.getUsersByName = async (searchName) => {
    if (!searchName) {
        throw new Error("Search name is required");
    }

    try {
        const regex = new RegExp(searchName, 'i'); // Case-insensitive search
        const users = await usermodel.find({
            $or: [
                { 'fullname.firstname': regex },
                { 'fullname.lastname': regex }
            ]
        }).select('-password');

        const defaultProfilePhoto = "https://res.cloudinary.com/dzqj1xk5h/image/upload/v1709301234/default_profile_photo.png";

        const userCardDetails = await Promise.all(users.map(async (user) => {
            const cc = await courseCreator.find({ advisorId: user._id }).populate('courses');

            return {
                _id: user._id,
                fullname: user.fullname.firstname + ' ' + user.fullname.lastname,
                bestSkill: user.bestSkill || "No skill specified",
                followers: user.followers.length.toString(),
                profilePhoto: user.profilePhoto || defaultProfilePhoto,
                courses: cc.length > 0 ? cc[0].courses.length.toString() : "0",
                avgRating: cc.length > 0 ? cc[0].avgRating.toString() : "0",
                email: user.email,
                phone: user.phone || "No phone number provided",

            };
        }));

        return userCardDetails;
    } catch (error) {
        throw new Error("Failed to search users by name: " + error.message);
    }
};

exports.getUserProfile = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    try {
        const user = await usermodel.findById(userId).select('-password');
        if (!user) {
            throw new Error("User not found");
        }

        const cc = await courseCreator.find({ advisorId: user._id }).populate('courses');
        const defaultProfilePhoto = "https://res.cloudinary.com/dzqj1xk5h/image/upload/v1709301234/default_profile_photo.png";

        // Fix: Check if cc exists and has courses before accessing
        let totalViews = 0;
        let coursesList = [];
        let coursesCount = "0";
        let avgRating = "0";

        if (cc && cc.length > 0 && cc[0].courses) {
            totalViews = cc[0].courses.reduce((acc, course) => acc + (course.views || 0), 0);
            coursesList = cc[0].courses.map(async (course) => {
                return await courseService.getCourseById(course._id);
            });
            coursesCount = cc[0].courses.length.toString();
            avgRating = cc[0].avgRating ? cc[0].avgRating.toString() : "0";
        }

        // const notificationList = await NotificationService.receiverNotification(userId);

        return {
            _id: user._id,
            fullname: user.fullname.firstname + ' ' + user.fullname.lastname,
            createdAt: user.createdAt,
            followers: user.followers.length.toString(),
            following: user.following.length.toString(),
            profilePhoto: user.profilePhoto || defaultProfilePhoto,
            courses: coursesCount,
            avgRating: avgRating,
            email: user.email,
            phone: user.phone || "No phone number provided",
            bio: user.bio || "No bio provided",
            totalViews: totalViews.toString(),
            //notifications: notificationList || [],
            coursesList: await Promise.all(coursesList)
        };
    } catch (error) {
        throw new Error("Failed to get user profile: " + error.message);
    }
}

exports.getUserEnrollments = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const userEnroll = await UserEnroll.findOne({ user: userId }).populate({
            path: 'courses',
            populate: {
                path: 'advisor',
                select: 'fullname email'
            }
        });

        console.log(userEnroll.courses);
        const Mycourses = userEnroll ? userEnroll.courses : [];

        const clearedCourses = Mycourses.map(course => {
            return {
                _id: course._id,
                title: course.title,
                description: course.description,
                priceInPoints: course.priceInPoints,
                categories: course.categories,
                tags: course.tags,
                advisor: {
                    _id: course.advisor?._id,
                    fullname: `${course.advisor?.fullname?.firstname} ${course.advisor?.fullname?.lastname}`,
                    email: course.advisor?.email
                },
                thumbnail: course.thumbnail,
                averageRating: course.averageRating,
                totalRatings: course.totalRatings,
                createdAt: course.createdAt,
                views: course.views
            }
        });
        return clearedCourses;
    } catch (error) {
        throw new Error("Failed to get user enrollments: " + error.message);
    }
};


exports.followUser = async (userId, followId) => {
    if (!userId || !followId) {
        throw new Error("User ID and Follow ID are required");
    }
    const follow = usermodel.findOne({ _id: followId });
    if (!follow) {
        throw new Error("User to follow not found");
    }
    const user = await usermodel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.following.includes(followId)) {
        throw new Error("Already following this user");
    }
    const followedUser = await usermodel.findById(followId);
    if (!followedUser.followers.includes(userId)) {
        followedUser.followers.push(userId);
        await followedUser.save();
    }
    user.following.push(followId);
    await user.save();
    return "Followed successfully";
}

exports.unfollowUser = async (userId, unfollowId) => {
    if (!userId || !unfollowId) {
        throw new Error("User ID and Unfollow ID are required");
    }
    const user = await usermodel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.following.includes(unfollowId)) {
        throw new Error("Not following this user");
    }

    user.following.pull(unfollowId);
    const unfollowedUser = await usermodel.findById(unfollowId);
    if (unfollowedUser.followers.includes(userId)) {
        unfollowedUser.followers.pull(userId);
        await unfollowedUser.save();
    }
    await user.save();
    return "Unfollowed successfully";
}
