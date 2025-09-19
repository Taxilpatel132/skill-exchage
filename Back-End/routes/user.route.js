const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const authmiddleware = require('../auth-middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/register', usercontroller.registerUser);
router.post('/login', usercontroller.loginUser);

router.get('/logout', authmiddleware.authUser, usercontroller.logout);

router.get('/my-enrollments', authmiddleware.authUser, usercontroller.getMyEnrollments);
router.post('/update-progress', authmiddleware.authUser, usercontroller.updateCourseProgress);
router.get('/follow/:followId', authmiddleware.authUser, usercontroller.followUser);
router.get('/unfollow/:unfollowId', authmiddleware.authUser, usercontroller.unfollowUser);
//router.get('/my-notifications', authmiddleware.authUser, usercontroller.getMyNotifications);
router.get('/mycard', authmiddleware.optionalAuthUser, usercontroller.mycard)

router.get('/profile/:userId', authmiddleware.optionalAuthUser, usercontroller.getOtherUserProfile);
router.get('/search/filtter/usercard', authmiddleware.optionalAuthUser, usercontroller.getUsersByName);
router.put('/profile/edit', authmiddleware.authUser, usercontroller.updateUserProfile);
router.post('/profile/upload-photo', authmiddleware.authUser, upload.single('profilePhoto'), usercontroller.uploadProfilePhoto);
router.get('/history', authmiddleware.authUser, usercontroller.getUserHistory);

module.exports = router;