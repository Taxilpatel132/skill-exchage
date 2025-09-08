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
router.get('/courses/:courseId', authMiddleware.optionalAuthUser, courseController.getCourse);
router.post('/courses/:courseId/enroll', authMiddleware.authUser, courseController.enrollInCourse);

//in progress
router.get('/courses/:title', authMiddleware.optionalAuthUser, courseController.getCourseByTitle);

router.post(`/courses/:courseId/question`, authMiddleware.authUser, courseController.askQuestion);
router.post('/courses/:courseId/question/:questionId/answer', authMiddleware.authUser, courseController.answerQuestion);
router.post('/courses/:courseId/rate', authMiddleware.authUser, courseController.rateCourse);
router.get('/courses/history', authMiddleware.authUser, courseController.getUserCourseHistory);
module.exports = router;