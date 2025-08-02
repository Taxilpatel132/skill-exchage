const courseService = require('../services/course.service');

exports.createCourse = async (req, res) => {
    try {
        const advisor = req.user; // Assuming the user is authenticated and their ID is available in req.user
        const { title, description, tags } = req.body;
        if (!title || !description || !advisor || !tags) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const savedCourse = await courseService.createCourse({ title, description, advisor, tags });
        if (!savedCourse) {
            return res.status(400).json({ message: "Failed to create course" });
        }
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();
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