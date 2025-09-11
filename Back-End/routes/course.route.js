const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.cotroller');
const authMiddleware = require('../auth-middleware/auth');


router.post('/create', authMiddleware.authUser, courseController.createCourse);
router.get('/search/all', authMiddleware.optionalAuthUser, courseController.getAllCourses);
router.get('/search/:courseId/enroll', authMiddleware.authUser, courseController.enrollInCourse);
router.get('/details/:courseId', authMiddleware.optionalAuthUser, courseController.getCourseDetailsUpdated);
router.get('/search', authMiddleware.optionalAuthUser, courseController.getCourseByTitle);



router.post(`/details/:courseId/question`, authMiddleware.authUser, courseController.askQuestion);
router.post('/details/:courseId/question/:questionId/answer', authMiddleware.authUser, courseController.answerQuestion);
router.post('/details/:courseId/rate', authMiddleware.authUser, courseController.addReviewToCourse);
module.exports = router;