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