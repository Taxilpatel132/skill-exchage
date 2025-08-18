const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.cotroller');
const authMiddleware = require('../auth-middleware/auth');

// Routes requiring authentication
router.post('/create', authMiddleware.authUser, courseController.createCourse);

// Routes that work for both authenticated and non-authenticated users
// - If user is logged in: personalized results (e.g., exclude user's own courses)
// - If user is not logged in: general results for all users
router.get('/all', authMiddleware.optionalAuthUser, courseController.getAllCourses);
router.get('/search', authMiddleware.optionalAuthUser, courseController.getCourseByTitle);

module.exports = router;