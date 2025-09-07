const { create } = require('../models/notification.model');
const courseService = require('../services/course.service');

exports.createCourse = async (req, res) => {
    try {
        const advisor = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { title, description, tags, category, priceInPoints, thumbnail } = req.body;
        if (!title || !description || !tags || !category || !priceInPoints || !thumbnail) {
            return res.status(400).json({ message: "All fields are required" });
        }
        console.log("Course created successfully:");
        const savedCourse = await courseService.createCourse({ title, description, tags, category, priceInPoints, thumbnail, advisor: advisor });

        if (!savedCourse) {
            return res.status(400).json({ message: "Failed to create course" });
        }


        const cc = await courseService.createCC({ courseId: savedCourse?._id, advisorId: advisor?._id })
        if (!cc) {
            return res.status(400).json({ message: "Failed to create course creator" });
        }
        const notificationData = {
            userId: advisor._id,
            message: `published a new course : ${savedCourse.title}`,
            type: 'course_creation'
        };
        const notification = await courseService.createNotificationOncreatecourse(notificationData);
        if (!notification) {
            return res.status(400).json({ message: "Failed to create notification" });
        }

        res.status(201).json({ course: savedCourse, courseCreator: cc, massage: "Course created successfully", notification: "notification is create" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses(req.user);
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.getCourseByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const courses = await courseService.getCourseByTitile(title);
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found with the given title" });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getCourse = async (req, res) => {
    try {
        // Assuming the user is authenticated and their ID is available in req.user
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const course = await courseService.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        course.views += 1;
        await course.save();
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


exports.askQuestion = async (req, res) => {
    try {
        const student = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { courseId } = req.params;
        const { question } = req.body;

        if (!courseId || !question || !student) {
            return res.status(400).json({ message: "Course ID, question, and student are required" });
        }
        const newQuestion = await courseService.askQuestion({ courseId, studentId: student._id, question });
        if (!newQuestion) {
            return res.status(400).json({ message: "Failed to post question" });
        }
        res.status(201).json({ question: newQuestion, message: "Question posted successfully" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.answerQuestion = async (req, res) => {
    try {
        const advisor = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { courseId, questionId } = req.params;
        const { answer } = req.body;

        if (!courseId || !questionId || !answer) {
            return res.status(400).json({ message: "Course ID, question ID, and answer are required" });
        }


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.enrollInCourse = async (req, res) => {
    try {
        const student = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const enrollment = await courseService.enrollInCourse({ courseId, studentId: student._id });
        if (!enrollment) {
            return res.status(400).json({ message: "Failed to enroll in course" });
        }
        res.status(201).json({ enrollment, message: "Enrolled in course successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.rateCourse = async (req, res) => {
    try {
        const student = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { courseId } = req.params;
        const { rating, review } = req.body;

        if (!courseId || !rating) {
            return res.status(400).json({ message: "Course ID and rating are required" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


