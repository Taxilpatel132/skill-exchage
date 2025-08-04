const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const Otp = require("../models/otp.model");
require("dotenv").config({ path: require('path').resolve(__dirname, '../../.env') }); // fixed path
const adminModel = require("../models/admin.model");
const usermodel = require("../models/users.model");
const sendOTP = async (toEmail) => {

    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        alphabets: false,
    });



    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER.trim() === "" || process.env.EMAIL_PASS.trim() === "") {
        console.error("EMAIL_USER or EMAIL_PASS environment variable is missing or empty.");
        throw new Error("Email credentials are not set in environment variables.");
    }




    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Use your real/verified sender email
        to: toEmail,
        subject: "Your OTP for Skill Exchange",
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return otp;
};

exports.generateAndSendOTP = async (email) => {

    try {
        const otp = await sendOTP(email);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        let otpdata = new Otp({
            email: email,
            otp: otp,
            expiresAt: expiresAt,
        });
        otpdata = await otpdata.save();
        return {
            message: "OTP sent successfully",
            otp: otp,
            expiresAt: expiresAt,
        };
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw new Error("Failed to send OTP");
    }
}
exports.verifyOTP = async (email, otp, role) => {
    try {
        const otpRecord = await Otp.findOne({ email: email, otp: otp });
        if (!otpRecord) {
            throw new Error("Invalid OTP");
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new Error("OTP has expired");
        }

        let token;
        await Otp.deleteOne({ _id: otpRecord._id });
        if (role == 'admin') {
            const admin = await adminModel.findOne({ email: email });
            if (!admin) {
                throw new Error("Admin not found");
            }
            token = admin.generateAuthToken();
        } else {
            const user = await usermodel.findOne({ Email: email });
            if (!user) {
                throw new Error("user not found");
            }
            token = user.generateAuthToken();
        }

        return {
            message: "OTP verified successfully"
            , token: token
        };
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
}



