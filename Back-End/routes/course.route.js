const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.cotroller');
const authMiddleware = require('../auth-middleware/auth');

router.post('/create', authMiddleware.authUser, courseController.createCourse);
router.get('/all', authMiddleware.authUser, courseController.getAllCourses);
router.get('/search', authMiddleware.authUser, courseController.getCourseByTitle);

module.exports = router;