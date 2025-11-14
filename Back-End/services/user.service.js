const usermodel = require("../models/users.model");
const courseCreator = require("../models/coures_creator.model");
const courseService = require("../services/course.service");

//const NotificationService = require("../services/notification.service");
const UserEnroll = require("../models/User_enroll.model");
const course = require("../models/course.model");
const ModuleModel = require("../models/module.model");

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
    const user = await usermodel.findOne({ email: email });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
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
        let avgRating = 0;
        let coursesWithRatings = 0;

        if (cc && cc.length > 0 && cc[0].courses) {
            totalViews = cc[0].courses.reduce((acc, course) => acc + (course.views || 0), 0);
            coursesList = cc[0].courses.map(async (course) => {
                const courseDetails = await courseService.getCourseById(course._id);
                return {
                    ...courseDetails,
                    advisor: {
                        _id: course.advisor, // Include advisor ID for comparison
                        ...courseDetails.advisor
                    }
                };
            });
            coursesCount = cc[0].courses.length.toString();

            // Calculate average rating with proper logic
            for (const course1 of cc[0].courses) {
                if (course1.averageRating > 0) {
                    avgRating += course1.averageRating;
                    coursesWithRatings++;
                }
            }
            avgRating = coursesWithRatings > 0 ? avgRating / coursesWithRatings : 0;
        }

        return {
            _id: user._id,
            fullname: user.fullname.firstname + ' ' + user.fullname.lastname,
            createdAt: user.createdAt,
            followers: user.followers.length.toString(),
            following: user.following.length.toString(),
            profilePhoto: user.profilePhoto || defaultProfilePhoto,
            courses: coursesCount,
            avgRating: avgRating ? avgRating.toFixed(3) : "0.000", // Ensure 3 decimal places
            email: user.email,
            phone: user.phone || "No phone number provided",
            bio: user.bio || "No bio provided",
            totalViews: totalViews.toString(),
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

        const Mycourses = userEnroll ? userEnroll.courses : [];

        // Get progress for each course
        const coursesWithProgress = await Promise.all(Mycourses.map(async (course) => {
            // Get or create progress record
            let progressRecord = await UserProgress.findOne({
                user: userId,
                course: course._id
            });

            if (!progressRecord) {
                // Get total modules for this course
                const totalModules = await ModuleModel.countDocuments({ courseId: course._id });

                // Create new progress record
                progressRecord = new UserProgress({
                    user: userId,
                    course: course._id,
                    totalModules,
                    progressPercentage: 0,
                    completedModules: [],
                    totalTimeSpent: 0,
                    isCompleted: false
                });
                await progressRecord.save();
            }

            // Calculate learning hours from course duration
            const durationMatch = course.duration?.match(/(\d+)/);
            const courseDurationHours = durationMatch ? parseInt(durationMatch[1]) : 0;

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
                views: course.views,
                duration: course.duration,
                // Progress tracking fields
                progress: progressRecord.progressPercentage,
                isCompleted: progressRecord.isCompleted,
                completedAt: progressRecord.completedAt,
                totalTimeSpent: progressRecord.totalTimeSpent, // in minutes
                lastAccessedAt: progressRecord.lastAccessedAt,
                totalModules: progressRecord.totalModules,
                completedModules: progressRecord.completedModules.length,
                estimatedHours: courseDurationHours
            };
        }));

        return coursesWithProgress;
    } catch (error) {
        throw new Error("Failed to get user enrollments: " + error.message);
    }
};

// Add method to update progress
exports.updateCourseProgress = async (userId, courseId, moduleId, timeSpent = 0) => {
    if (!userId || !courseId || !moduleId) {
        throw new Error("User ID, Course ID, and Module ID are required");
    }

    try {
        let progressRecord = await UserProgress.findOne({
            user: userId,
            course: courseId
        });

        if (!progressRecord) {
            // Get total modules for this course
            const totalModules = await ModuleModel.countDocuments({ courseId });

            // Create new progress record
            progressRecord = new UserProgress({
                user: userId,
                course: courseId,
                totalModules,
                progressPercentage: 0,
                completedModules: [],
                totalTimeSpent: 0,
                isCompleted: false
            });
        }

        // Add completed module
        progressRecord.addCompletedModule(moduleId, timeSpent);
        await progressRecord.save();

        return progressRecord;
    } catch (error) {
        throw new Error("Failed to update course progress: " + error.message);
    }
};

// Add method to get enrollment statistics
exports.getEnrollmentStats = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const progressRecords = await UserProgress.find({ user: userId })
            .populate('course', 'duration');

        const stats = {
            totalCourses: progressRecords.length,
            inProgress: 0,
            completed: 0,
            totalHours: 0,
            totalMinutesSpent: 0
        };

        progressRecords.forEach(record => {
            if (record.isCompleted) {
                stats.completed++;
            } else if (record.progressPercentage > 0) {
                stats.inProgress++;
            }

            // Add actual time spent
            stats.totalMinutesSpent += record.totalTimeSpent;

            // Add estimated course hours
            if (record.course && record.course.duration) {
                const durationMatch = record.course.duration.match(/(\d+)/);
                const courseDurationHours = durationMatch ? parseInt(durationMatch[1]) : 0;
                stats.totalHours += courseDurationHours;
            }
        });

        // Convert minutes to hours for display
        stats.actualHoursSpent = Math.round(stats.totalMinutesSpent / 60 * 10) / 10; // Round to 1 decimal

        return stats;
    } catch (error) {
        throw new Error("Failed to get enrollment stats: " + error.message);
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
exports.mycard = async (userId) => {
    if (!userId) {
        throw new Error("user id is required");
    }
    try {

        const user = await usermodel.findById(userId);
        if (!user) {
            throw new Error("user not found");
        }
        const data = await courseCreator.find({ advisorId: userId }).populate("advisorId courses");

        if (!data || data.length === 0) {
            return {
                _id: user._id,
                fullname: user.fullname.firstname + ' ' + user.fullname.lastname,
                email: user.email,
                courses: "0",
                avgRating: "0.000",
                students: "0",
                points: user.points.toString()

            }
        }

        let totalStudents = 0;
        let avgRating = 0;
        let coursesWithRatings = 0;
        for (const course1 of data[0].courses) {
            totalStudents += course1.enrollmentCount;
            if (course1.averageRating > 0) {
                avgRating += course1.averageRating;
                coursesWithRatings++;
            }
        }


        avgRating = coursesWithRatings > 0 ? avgRating / coursesWithRatings : 0;

        return {
            _id: user._id,
            fullname: user.fullname.firstname + ' ' + user.fullname.lastname,
            email: user.email,
            courses: data[0].courses.length.toString(),
            avgRating: avgRating ? avgRating.toFixed(3) : "0.000",
            students: totalStudents.toString(),
            points: user.points.toString()
        }
    } catch (error) {
        throw new Error("Failed to get user card: " + error.message);
    }
}

exports.updateUserProfile = async (userId, updateData) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {

        const updateObject = {};


        if (updateData.fullname) {
            const { fullname } = updateData;
            if (!fullname.firstname || !fullname.lastname) {
                throw new Error("First name and last name are required");
            }
            updateObject.fullname = {
                firstname: fullname.firstname.trim(),
                lastname: fullname.lastname.trim()
            };
        }

        // Add optional fields if provided
        if (updateData.bio !== undefined) {
            updateObject.bio = updateData.bio.trim();
        }

        if (updateData.profilePhoto !== undefined) {
            updateObject.profilePhoto = updateData.profilePhoto.trim();
        }

        if (updateData.phone !== undefined) {
            // Validate phone number if provided and not empty
            if (updateData.phone && !/^\d{10}$/.test(updateData.phone)) {
                throw new Error("Phone number must be 10 digits");
            }
            updateObject.phone = updateData.phone.trim();
        }

        const updatedUser = await usermodel.findByIdAndUpdate(
            userId,
            updateObject,
            {
                new: true,
                runValidators: false, // Disable validation for partial updates
                select: '-password' // Exclude password from response
            }
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser;
    } catch (error) {
        throw new Error(`Failed to update user profile: ${error.message}`);
    }
};

// Advanced user search with filters
exports.searchUsersWithFilters = async (filters) => {
    try {
        let query = {};


        if (filters.searchQuery && filters.searchQuery.trim()) {
            const searchRegex = new RegExp(filters.searchQuery.trim(), 'i');
            query.$or = [
                { 'fullname.firstname': searchRegex },
                { 'fullname.lastname': searchRegex },
                { username: searchRegex },
                { bio: searchRegex },
                { experience: searchRegex }
            ];
        }


        if (filters.author && filters.author.trim()) {
            const authorRegex = new RegExp(filters.author.trim(), 'i');
            if (!query.$or) {
                query.$or = [];
            }
            query.$or.push(
                { 'fullname.firstname': authorRegex },
                { 'fullname.lastname': authorRegex },
                { username: authorRegex }
            );
        }


        if (filters.userType && filters.userType.trim() && filters.userType !== '') {
            const typeRegex = new RegExp(filters.userType.trim(), 'i');
            query.experience = typeRegex;
        }



        const users = await usermodel.find(query)
            .select('fullname username profilePhoto bio experience followers email createdAt')
            .sort({ followers: -1, createdAt: -1 })
            .limit(50);


        const transformedUsers = await Promise.all(users.map(async user => {

            const courseCount = await courseCreator.countDocuments({ advisorId: user._id }).populate('courses');
            let totalRating = 0;
            let avgRating = 0;
            for (const course of courses) {
                //calculate average rating
                totalRating += course.averageRating;
                if (course.averageRating > 0) {
                    coursesWithRatings++;
                }
                avgRating = coursesWithRatings > 0 ? totalRating / coursesWithRatings : 0;
            }

            //cal the experience
            let day = user.createdAt;
            let today = new Date();
            let diffInMs = today - day;
            let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            let experienceText;
            if (diffInDays < 30) {
                experienceText = "newbie";
            } else if (diffInDays < 365) {
                let months = Math.floor(diffInDays / 30);
                experienceText = `${months} month${months > 1 ? 's' : ''}+`;
            } else {
                let years = Math.floor(diffInDays / 365);
                experienceText = `${years} year${years > 1 ? 's' : ''}+`;
            }


            return {
                _id: user._id,
                name: user.fullname ? `${user.fullname.firstname} ${user.fullname.lastname}` : user.username,
                username: user.username,
                profileImage: user.profilePhoto,
                bio: user.bio,
                experience: user.experience,
                followers: user.followers || 0,
                expertise: user.experience || 'General',
                totalCourses: courseCount,
                averageRating: avgRating, 
                createdAt: user.createdAt,
                accountAge: experienceText
            };
        }));

        return transformedUsers;
    } catch (error) {
        console.error('Error searching users with filters:', error);
        throw new Error(`Failed to search users: ${error.message}`);
    }
};
exports.Isfollow = async (userId, followId) => {
    if (!userId || !followId) {
        throw new Error("User ID and Follow ID are required");
    }
    const user = await usermodel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.following.includes(followId)) {
        return true;
    }
    return false;
}
exports.getEnrollment = async (userId, courseId) => {
    if (!userId || !courseId) {
        throw new Error("User ID and Course ID are required");
    }
    const enrollment = await UserEnroll.findOne({ user: userId });
    if (!enrollment) {
        throw new Error("Enrollment not found");
    }
    if (enrollment.courses.includes(courseId)) {
        return true;
    }
    else {
        return false;
    }

}
