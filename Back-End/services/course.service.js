const courseModel = require('../models/course.model');
const userModel = require('../models/users.model');
const ModuleModel = require('../models/module.model');
const UserCourses = require('../models/coures_creator.model');
const UserEnroll = require("../models/User_enroll.model");
const Notification = require('../models/notification.model');
const CourseQA = require('../models/course_qa.model');
const reviewModel = require('../models/review.model');
//const CourseReview = require('../models/course_review.model');
exports.createCourse = async (courseData, modules) => {
    try {
        const {
            title,
            description,
            fullDescription,
            category,
            level,
            priceInPoints,
            duration,
            language,
            thumbnail,
            trailerVideo,
            skills,
            learningObjectives,
            prerequisites,
            courseHighlights,
            tools,
            targetAudience,
            certificate,

            advisor
        } = courseData;

        // Validate required fields
        if (!title || !description || !fullDescription || !category || !level || !priceInPoints || !duration || !thumbnail || !skills || !advisor) {
            throw new Error("Required fields are missing");
        }

        // First create the course without modules
        const course = new courseModel({
            title,
            description,
            fullDescription,
            category,
            level,
            priceInPoints,
            duration,
            language: language || 'English',
            thumbnail,
            trailerVideo: trailerVideo || '',
            skills,
            learningObjectives: learningObjectives || [],
            prerequisites: prerequisites || [],
            courseHighlights: courseHighlights || [],
            tools: tools || [],
            targetAudience: targetAudience || [],
            certificate: certificate !== undefined ? certificate : true,
            modules: [], // Initialize empty, will add module IDs later
            advisor
        });

        const savedCourse = await course.save();
        if (!savedCourse) {
            throw new Error("Failed to create course");
        }

        // Now create modules with the course ID
        const moduleArray = modules || [];
        const createdModules = [];

        if (moduleArray.length > 0) {
            for (let i = 0; i < moduleArray.length; i++) {
                const mod = moduleArray[i];
                if (!mod.title) {
                    throw new Error(`Module at index ${i} is missing required fields`);
                }

                const createdModule = await ModuleModel.create({
                    ...mod,
                    courseId: savedCourse._id
                });
                createdModules.push(createdModule._id);
            }

            // Update the course with module IDs
            savedCourse.modules = createdModules;
            await savedCourse.save();
        }

        console.log("Created modules:", createdModules);

        return savedCourse;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getAllCourses = async (data) => {

    if (!data || !data._id) {
        const allCourses = await courseModel.find({ status: { $ne: "blocked" } }).populate('advisor', 'fullname.firstname fullname.lastname email');
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

    const userCourses = await UserCourses.findOne({ advisorId: data._id }).populate('courses');
    const userCreatedCourseIds = userCourses ? userCourses.courses.map(course => course._id) : [];

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

exports.getCourseByTitle = async (title) => {
    const courses = await courseModel.find({ status: { $ne: "blocked" } }).populate('advisor', 'fullname.firstname fullname.lastname email');
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

    const completedCourses = c.map(course => {

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
    return completedCourses;
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
    if (!courseId || !studentId || !question) {
        throw new Error("Course ID, Student ID, and question are required");
    }
    const courses = await UserEnroll.findOne({ user: studentId }).populate('courses');
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    const C = courses.courses.map(c => c._id.toString());

    if (!C || !C.includes(courseId)) {
        throw new Error("User is not enrolled in this course");
    }

    if (course.advisor.toString() === studentId) {
        throw new Error("Course advisor cannot ask questions");
    }
    const newQuestion = new CourseQA({
        courseId: courseId,
        studentId: studentId,
        question
    });
    await newQuestion.save();

    return newQuestion;
};



exports.createNotification = async (notificationData) => {
    const { receiverId, senderId, type, courseId, message } = notificationData;

    if (!receiverId || !type) {
        throw new Error("Receiver ID and type are required for notification");
    }

    const notification = new Notification({
        receiver: receiverId,
        sender: senderId,
        type,
        course: courseId,
        message
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
    if (course.advisor.toString() === studentId) {
        throw new Error("Course advisor cannot enroll in their own course");
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



exports.answerQuestion = async (answerData) => {
    const { questionId, instructorId, answer } = answerData;
    if (!questionId || !instructorId || !answer) {
        throw new Error("Question ID, Instructor ID, and answer are required");
    }

    const question = await CourseQA.findById(questionId);
    if (!question) {
        throw new Error("Question not found");
    }

    const course = await courseModel.findById(question.courseId);
    if (!course) {
        throw new Error("Course not found for the question");
    }
    console.log(course.advisor.toString(), instructorId);
    if (course.advisor.toString() !== instructorId.toString()) {
        throw new Error("Only the course advisor can answer this question");
    }

    question.answer = {
        text: answer,
        answeredBy: instructorId,
        answeredAt: new Date()
    };
    question.status = 'answered';

    await question.save();
    return question;
};

exports.rateCourse = async (rateData) => {
    const { courseId, studentId, rating, review } = rateData;
    console.log('reviews service', courseId, studentId, rating, review);
    if (!courseId || !studentId || !rating) {
        throw new Error("Course ID, Student ID, and rating are required");
    }

    if (!review || review.trim() === "") {
        throw new Error("Review text is required");
    }

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    const user = await userModel.findById(studentId);
    if (!user) {
        throw new Error("User not found");
    }

    const courses = await UserEnroll.findOne({ user: studentId }).populate('courses');
    if (!courses || !courses.courses.some(c => c._id.toString() === courseId)) {
        throw new Error("User is not enrolled in this course");
    }

    // Check if user has already reviewed this course
    let existingReview = await reviewModel.findOne({ courseId, userId: studentId });
    let isNewReview = !existingReview;

    if (existingReview) {

        const oldRating = existingReview.rating;
        existingReview.rating = rating;
        existingReview.review = review;
        await existingReview.save();

        // Recalculate average rating (replace old rating with new one)
        const currentSum = course.totalRatings * course.averageRating;
        const newSum = currentSum - oldRating + rating;
        course.averageRating = parseFloat((newSum / course.totalRatings).toFixed(3));
    } else {

        const newReview = new reviewModel({
            courseId,
            userId: studentId,
            rating,
            review
        });
        await newReview.save();

        // Update course rating statistics
        const currentSum = course.totalRatings * course.averageRating;
        const newSum = currentSum + rating;
        const newTotal = course.totalRatings + 1;
        course.averageRating = parseFloat((newSum / newTotal).toFixed(3));
        course.totalRatings = newTotal;
    }

    await course.save();

    return {
        averageRating: course.averageRating,
        totalRatings: course.totalRatings,
        userReview: {
            rating,
            review,
            isNewReview
        }
    };
}

// Get course with full details for display (unified model)
exports.getCourseDetailsForDisplay = async (courseId) => {
    try {
        const course = await courseModel.findById(courseId)
            .populate('advisor', 'fullname username profilePhoto profilePicture bio experience followers email')
            .populate('modules');

        if (!course) {
            throw new Error('Course not found');
        }

        // Increment views
        course.views += 1;
        await course.save();

        return course;
    } catch (error) {
        throw new Error(`Failed to get course details: ${error.message}`);
    }
};

// Add module to course using unified model
exports.addModuleToCourse = async (courseId, moduleData) => {
    try {
        const course = await Course.findById(courseId);

        if (!course) {
            throw new Error('Course not found');
        }

        // Use the course model's addModule method
        await course.addModule(moduleData);

        return course;
    } catch (error) {
        throw new Error(`Failed to add module: ${error.message}`);
    }
};

// Get modules for a course using unified model
exports.getCourseModules = async (courseId) => {
    try {
        const course = await Course.findById(courseId).select('modules');

        if (!course) {
            throw new Error('Course not found');
        }

        return course.getOrderedModules();
    } catch (error) {
        throw new Error(`Failed to get course modules: ${error.message}`);
    }
};

// Get reviews for a course
exports.getCourseReviews = async (courseId) => {
    try {
        const reviews = await reviewModel.find({ courseId })
            .populate('userId', 'fullname username profilePhoto profilePicture')
            .sort({ createdAt: -1 });

        if (!reviews) {
            return [];
        }

        // Format reviews for frontend
        return reviews.map(review => ({
            _id: review._id,
            rating: review.rating,
            review: review.review,
            createdAt: review.createdAt,
            userId: {
                fullname: review.userId?.fullname,
                username: review.userId?.username,
                profilePhoto: review.userId?.profilePhoto || review.userId?.profilePicture
            }
        }));
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error(`Failed to get course reviews: ${error.message}`);
    }
};