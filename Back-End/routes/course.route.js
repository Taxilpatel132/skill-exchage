const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.cotroller');
const authMiddleware = require('../auth-middleware/auth');

// Routes requiring authentication
router.post('/create', authMiddleware.authUser, courseController.createCourse);

// Routes that work for both authenticated and non-authenticated users
// - If user is logged in: personalized results (e.g., exclude user's own courses)
// - If user is not logged in: general results for all users
router.get('/search/all', authMiddleware.optionalAuthUser, courseController.getAllCourses);
router.get('/search/:courseId', authMiddleware.optionalAuthUser, courseController.getCourse);
router.post('/search/:courseId/enroll', authMiddleware.authUser, courseController.enrollInCourse);

router.get('/details/:courseId', authMiddleware.optionalAuthUser, courseController.getCourseDetails);
//in progress
router.get('/search/:title', authMiddleware.optionalAuthUser, courseController.getCourseByTitle);

router.post(`/details/:courseId/question`, authMiddleware.authUser, courseController.askQuestion);
router.post('/details/:courseId/question/:questionId/answer', authMiddleware.authUser, courseController.answerQuestion);
router.post('/details/:courseId/rate', authMiddleware.authUser, courseController.addReviewToCourse);
module.exports = router;