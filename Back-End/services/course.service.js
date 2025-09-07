const courseModel = require('../models/course.model');
const userModel = require('../models/users.model');
const ratingModel = require('../models/rating.model');
const UserCourses = require('../models/coures_creator.model');
const UserEnroll = require("../models/User_enroll.model");
exports.createCourse = async (courseData) => {
    const { title, description, tags, category, priceInPoints, thumbnail, advisor } = courseData;

    if (!title || !description || !tags || !category || !priceInPoints || !thumbnail) {
        throw new Error("All fields are required");
    }

    const course = new courseModel({
        title,
        description,
        advisor,
        tags,
        category,
        priceInPoints,
        thumbnail,

    });
    const savedCourse = await course.save();
    return savedCourse;
}

exports.getAllCourses = async (data) => {
    // If user is not logged in, return all courses
    if (!data || !data._id) {
        const allCourses = await courseModel.find({ status: { $ne: "blocked" } }).populate('advisor', 'name email');
        if (!allCourses || allCourses.length === 0) {
            throw new Error("No courses found");
        }
        return allCourses;
    }

    // If user is logged in, exclude their own created courses
    //console.log(data._id);
    const userCourses = await UserCourses.findOne({ advisorId: data._id }).populate('courses');
    const userCreatedCourseIds = userCourses ? userCourses.courses.map(course => course._id) : [];
    //console.log(userCreatedCourseIds);
    const allCourses = await courseModel.find({
        status: { $ne: "blocked" },
        _id: { $nin: userCreatedCourseIds }
    }).populate('advisor', 'fullname.firstname fullname.lastname email')

    if (!allCourses || allCourses.length === 0) {
        throw new Error("No courses found");
    }
    const clearedCourses = allCourses.map(course => {
        return {
            _id: course?._id,
            title: course.title,
            description: course.description,
            priceInPoints: course.priceInPoints,
            categories: course.categories,
            tags: course.tags,
            advisor: {
                _id: course.advisor?._id,
                fullname: `${course.advisor?.fullname.firstname} ${course.advisor?.fullname.lastname}`,
                email: course.advisor?.email
            },
            thumbnail: course.thumbnail,
            averageRating: course.averageRating,
            totalRatings: course.totalRatings,
            createdAt: course.createdAt,
            views: course.views
        };
    });
    return clearedCourses;
}

exports.getCourseByTitile = async (title) => {
    const courses = await courseModel.find({ status: { $ne: "blocked" } }).populate('advisor', 'name email')
    if (!title) {
        throw new Error("Title is required");
    }
    if (!courses || courses.length === 0) {
        throw new Error("No courses found");
    }
    const c = courses.filter(course => course.title.toLowerCase().includes(title.toLowerCase()));
    if (c.length === 0) {
        throw new Error("No courses found with the given title");
    }
    return c;
}
exports.updatetoBlacked = async (courseId) => {
    const course = await courseModel.findById({
        _id: courseId,
        status: { $ne: "blocked" }
    });
    if (!course) {
        throw new Error("Course not found");
    }
    course.status = "blocked";
    const updatedCourse = await course.save();
    return updatedCourse;
}
exports.getCourseById = async (courseId) => {
    const course = await courseModel.findById(courseId).populate('advisor');
    if (!course) {
        throw new Error("Course not found");
    }
    return {
        _id: course?._id,
        title: course.title,
        description: course.description,
        priceInPoints: course.priceInPoints,
        categories: course.categories,
        tags: course.tags,
        advisor: {
            _id: course.advisor?._id,
            fullname: `${course.advisor?.fullname.firstname} ${course.advisor?.fullname.lastname}`,
            email: course.advisor?.email
        },
        thumbnail: course.thumbnail,
        averageRating: course.averageRating,
        totalRatings: course.totalRatings,
        createdAt: course.createdAt,
        views: course.views
    };
}


exports.createCC = async (ccData) => {
    const { courseId, advisorId } = ccData;
    let userCourses = await UserCourses.findOne({ advisorId });
    if (!userCourses) {
        userCourses = new UserCourses({
            advisorId,
            courses: [courseId],
        });
    } else {
        userCourses.courses.push(courseId);
    }
    await userCourses.save();
    return userCourses;
};

exports.askQuestion = async (questionData) => {
    const { courseId, studentId, question } = questionData;
    const course = await courseModel.findById(courseId).populate;
    if (!course) {
        throw new Error("Course not found");
    }
    const user = await userModel.findById(studentId);
    if (!user) {
        throw new Error("User not found");
    }

    // Check if the user is enrolled in the course

    const newQuestion = {
        student: studentId,
        question,
        answers: []
    };
    course.questions.push(newQuestion);
    await course.save();
    return newQuestion;
};

exports.createNotificationOncreatecourse = async (notificationData) => {
    const Notification = require('../models/notification.model');
    const { userId, message, type } = notificationData;

    if (!userId || !message || !type) {
        throw new Error("All fields are required for notification");
    }

    const notification = new Notification({
        user: userId,
        message,
        type
    });

    const savedNotification = await notification.save();
    return savedNotification;
}

exports.enrollInCourse = async (enrollData) => {
    const { courseId, studentId } = enrollData;
    if (!courseId || !studentId) {
        throw new Error("Course ID and Student ID are required");
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    const user = await userModel.findById(studentId);
    if (!user) {
        throw new Error("User not found");
    }


    let userEnroll = await UserEnroll.findOne({ user: studentId });

    if (!userEnroll) {
        userEnroll = new UserEnroll({
            user: studentId,
            courses: [courseId]
        });
    } else {
        if (userEnroll.courses.includes(courseId)) {
            throw new Error("User is already enrolled in this course");
        }
        userEnroll.courses.push(courseId);
    }

    await userEnroll.save();
    return userEnroll;
};