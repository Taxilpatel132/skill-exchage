const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const authmiddleware = require('../auth-middleware/auth');
router.post('/register', usercontroller.registerUser);
router.post('/login', usercontroller.loginUser);

router.get('/logout', authmiddleware.authUser, usercontroller.logout);
// progress 
//router.put('/block-course', authmiddleware.authUser, usercontroller.blockedCourse);



router.post('/send-otp', usercontroller.forgotPassword);
router.post('/verify-otp', usercontroller.verifyOTP);
router.put('/update-password', usercontroller.createNewPassword);
//fitter of usercsrd
router.get('/search/filtter/usercard', authmiddleware.optionalAuthUser, usercontroller.getUsersByName);



router.get('/profile/:userId', authmiddleware.optionalAuthUser, usercontroller.getOtherUserProfile);
router.get('/my-enrollments', authmiddleware.authUser, usercontroller.getMyEnrollments);



router.get('/follow/:followId', authmiddleware.authUser, usercontroller.followUser);
router.get('/unfollow/:unfollowId', authmiddleware.authUser, usercontroller.unfollowUser);
module.exports = router;