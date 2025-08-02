const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const authmiddleware = require('../auth-middleware/auth');
router.post('/register', usercontroller.registerUser);
router.post('/login', usercontroller.loginUser);
router.get('/profile', authmiddleware.authUser, usercontroller.getuserProfile);
router.get('/logout', authmiddleware.authUser, usercontroller.logout);
/*router.put('/add-skills', authmiddleware.authUser, usercontroller.addSkill);
router.put('/update-profile-photo', authmiddleware.authUser, usercontroller.updateProfilePhoto);
router.put('/update-education', authmiddleware.authUser, usercontroller.updateEducation);*/
router.put('/block-course', authmiddleware.authUser, usercontroller.blockedCourse);
router.post('/forgot-password', usercontroller.forgotPassword);
router.post('/verify-otp', usercontroller.verifyOTP);
router.put('/update-password', usercontroller.createNewPassword);
module.exports = router;
