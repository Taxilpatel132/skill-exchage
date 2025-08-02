const usermodel = require("../models/users.model");


exports.createuser = async (userData) => {
    const { Fullname, Email, Password, Phone } = userData;
    if (!Fullname || !Email || !Password || !Phone) {
        throw new Error("something is wrong");
    }

    const UserExist = await usermodel.findOne({ Email: Email });
    if (UserExist) {
        throw new Error("User already exists");
    }
    const hashpassword = await usermodel.hashpassword(Password);
    const User = new usermodel({
        Fullname, Password: hashpassword, Email, Phone,
    })
    const savedUser = await User.save();
    return savedUser;
}
exports.loginUser = async (userData) => {
    const { Email, Password } = userData;
    if (!Email || !Password) {
        throw new Error("email and password are require");
    }
    const user = await usermodel.findOne({ Email: Email });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await user.comparepassword(Password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    //const token = user.generateAuthToken();
    return user;
}
exports.findByEmail = async (email) => {
    if (!email) {
        throw new Error("Email is required");
    }
    const user = await usermodel.findOne({ Email: email });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

exports.updatePassword = async (passData) => {
    const { password, token } = passData;

    if (!password || !token) {
        throw new Error("Password and token are required");
    }

    try {
        // Verify the token and extract user ID
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded._id;

        const hashpassword = await usermodel.hashpassword(password);
        const updatedUser = await usermodel.findByIdAndUpdate(
            userId,
            { Password: hashpassword },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("Failed to update password");
        }
        return updatedUser;
    } catch (error) {
        throw new Error("Invalid or expired reset token");
    }
}
