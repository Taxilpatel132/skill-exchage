const otpService = require("./otp.service");
const adminModel = require("../models/admin.model");
exports.sendOtp = async (email) => {
    const admiExist = await adminModel.findOne({ email: email });
    if (!admiExist) {
        throw new Error("Admin does not exist");
    }
    const otpdata = await otpService.generateAndSendOTP(email);

    return otpdata;


}
exports.verifyOtp = async (email, otp) => {
    const adminExist = await adminModel.findOne({ email: email });
    if (!adminExist) {
        throw new Error("Admin does not exist");
    }
    const isValid = await otpService.verifyOTP(email, otp, 'admin');
    if (!isValid) {
        throw new Error("Invalid or expired OTP");
    }
    return { message: "OTP verified successfully", token: isValid.token };
}

