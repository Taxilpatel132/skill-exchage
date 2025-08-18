const usermodel = require("../models/users.model");
const courseCreator = require("../models/coures_creator.model");
const courseService = require("../services/course.service");
const UserCourseHistory = require("../models/course_learner.model");
const NotificationService = require("../services/notification.service");
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



exports.getUserCardDetails = async () => {
    try {
        const users = await usermodel.find({}).select('-password');
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
        throw new Error("Failed to get user card details: " + error.message);
    }
};

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
        const totalViews = cc[0].courses.reduce((acc, course) => acc + (course.views || 0), 0);
        const couresList = cc[0].courses.map(async (course) => {
            return await courseService.getCourseById(course._id);
        });
        const notificationList = await NotificationService.receiverNotification(userId);
        if (!notificationList || notificationList.length === 0) {
            notificationList = [];
        }
        return {
            _id: user._id,
            fullname: user.fullname.firstname + ' ' + user.fullname.lastname,
            createdAt: user.createdAt,
            followers: user.followers.length.toString(),
            following: user.following.length.toString(),
            profilePhoto: user.profilePhoto || defaultProfilePhoto,
            courses: cc.length > 0 ? cc[0].courses.length.toString() : "0",
            avgRating: cc.length > 0 ? cc[0].avgRating.toString() : "0",
            email: user.email,
            phone: user.phone || "No phone number provided",
            bio: user.bio || "No bio provided",
            totalViews: totalViews.toString(),
            notifications: notificationList,
            coursesList: await Promise.all(couresList)
        };
    } catch (error) {
        throw new Error("Failed to get user profile: " + error.message);
    }
}

exports.getUserHistory = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    try {

        const history = await UserCourseHistory.find({ userId })
            .populate('courseId');

        // Format the result for clarity
        const enrollmentCourses = history.map(entry => ({
            course: {
                _id: entry.courseId._id,
                title: entry.courseId.title,
                description: entry.courseId.description,
                thumbnail: entry.courseId.thumbnail,
                categories: entry.courseId.categories,
                tags: entry.courseId.tags,
            },
            enrollmentDate: entry.enrollmentDate,
            progress: entry.progress
        }));

        const coures_creator = await courseCreator.find({ advisorId: userId }).populate('courses');
        const createdCoursesIds = coures_creator[0].courses.map(course => {
            return course._id;
        })
        const earningsHistory = await UserCourseHistory.find({ courseId: { $in: createdCoursesIds } })
            .populate('courseId');
        const earningsCourses = earningsHistory.map(entry => ({
            course: {
                _id: entry.courseId._id,
                title: entry.courseId.title,
                description: entry.courseId.description,
                thumbnail: entry.courseId.thumbnail,
                categories: entry.courseId.categories,
                tags: entry.courseId.tags,
            },
            enrollmentDate: entry.enrollmentDate,
            progress: entry.progress

        }));
        return {
            enrollmentCourses,
            createdCourses: earningsCourses
        };
    } catch (error) {
        throw new Error("Failed to get user history: " + error.message);
    }
}