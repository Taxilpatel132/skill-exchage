const BlacklistToken = require("../models/blacklisttoken.model");

exports.addTokenToBlacklist = async (token) => {
    if (!token) {
        throw new Error("Token is required");
    }
    const bltExist = await BlacklistToken.findOne({ token });
    if (bltExist) {
        throw new Error("token is present is blt");
    }
    const blacklistToken = new BlacklistToken({ token });
    return await blacklistToken.save();
}