const express = require('express');
const router = express.Router();
//const usercontroller = require('../controllers/user.controller');
const authmiddleware = require('../auth-middleware/auth');
const admincontroller = require('../controllers/admin.controller');

router.post('/send-otp', admincontroller.sendOtp);
router.post('/verify', admincontroller.verifyOtp);
//router.get('/profile', authmiddleware.authAdmin, admincontroller.getProfile);
router.get('/logout', authmiddleware.authAdmin, admincontroller.logout);
//router.put("/update-profile-photo", authmiddleware.authAdmin, admincontroller.updateProfilePhoto);
router.put("/block-course", authmiddleware.authAdmin, admincontroller.blockCourse);
module.exports = router;