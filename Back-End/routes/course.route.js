const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.cotroller');
const authMiddleware = require('../auth-middleware/auth');


// Course creation (requires authentication)
router.post('/create', authMiddleware.authUser, courseController.createCourse);

// Course update (requires authentication)
router.put('/update/:courseId', authMiddleware.authUser, courseController.updateCourse);

// Course viewing (optional authentication - shows personalized data if logged in)
router.get('/search/all', authMiddleware.optionalAuthUser, courseController.getAllCourses);
router.get('/details/:courseId', authMiddleware.optionalAuthUser, courseController.getCourseDetails);
router.get('/search', authMiddleware.optionalAuthUser, courseController.getCourseByTitle);

// Actions requiring authentication (sensitive operations)
router.get('/search/:courseId/enroll', authMiddleware.authUser, courseController.enrollInCourse);
router.post('/details/:courseId/question', authMiddleware.authUser, courseController.askQuestion);
router.post('/details/:courseId/question/:questionId/answer', authMiddleware.authUser, courseController.answerQuestion);
router.post('/details/:courseId/rate', authMiddleware.authUser, courseController.addReviewToCourse);

// Get reviews and Q&A (optional auth - may show different data based on enrollment)
router.get('/details/:courseId/reviews', authMiddleware.optionalAuthUser, courseController.getCourseReviews);
router.get('/details/:courseId/qa', authMiddleware.optionalAuthUser, courseController.getCourseQA);

module.exports = router;