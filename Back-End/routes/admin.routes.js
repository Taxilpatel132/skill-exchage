const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

const authmiddleware = require('../auth-middleware/auth');

// Admin authentication routes
router.post('/send-otp', adminController.sendOtp);
router.post('/verify', adminController.verifyOtp);
router.get('/logout', authmiddleware.authAdmin, adminController.logout);

// User management routes
router.get('/users', authmiddleware.authAdmin, adminController.getAllUsers);
router.get('/users/:userId', authmiddleware.authAdmin, adminController.getUserById);
router.patch('/users/:userId/block', authmiddleware.authAdmin, adminController.blockUser);
router.patch('/users/:userId/unblock', authmiddleware.authAdmin, adminController.unblockUser);

// Course management routes
router.put("/block-course", authmiddleware.authAdmin, adminController.blockCourse);

// Search routes for admin
router.get('/search/users', authmiddleware.authAdmin, adminController.searchUsers);
router.get('/search/courses', authmiddleware.authAdmin, adminController.searchCourses);

module.exports = router;
