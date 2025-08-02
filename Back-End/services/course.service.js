const courseModel = require('../models/course.model');
const userModel = require('../models/users.model');
const ratingModel = require('../models/rating.model');

exports.createCourse = async (courseData) => {
    const { title, description, advisor, tags } = courseData;

    if (!title || !description || !advisor || !tags) {
        throw new Error("All fields are required");
    }
    const advisorExists = await userModel.findById(advisor);
    if (!advisorExists) {
        throw new Error("Advisor does not exist");
    }
    const course = new courseModel({
        title,
        description,
        advisor,
        tags,
    });
    const savedCourse = await course.save();
    return savedCourse;
}

exports.getAllCourses = async () => {
    const courses = await courseModel.find({ status: { $ne: "blocked" } }).populate('advisor', 'name email')
    if (!courses || courses.length === 0) {
        throw new Error("No courses found");
    }
    return courses;
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
    return course;
}

