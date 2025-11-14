const jwt = require("jsonwebtoken");
const usermodel = require("../models/users.model");
const blackListTokenModel = require("../models/blacklisttoken.model");
exports.authUser = async (req, res, next) => {

    const token = req.cookies.token ||
        (req.headers.authorization?.startsWith('Bearer ') ?
            req.headers.authorization.split(" ")[1] :
            null);
    ;
    if (!token) {

        return res.status(401).json({
            message: "not valid"
        })
    }

    const istoken = await blackListTokenModel.findOne({ token });

    if (istoken) {
        return res.status(401).json({
            message: "unauthorization"
        })
    }

    try {
        let decode;
        try {

            const rawToken = token.replace(/^"|"$/g, '');

            decode = jwt.verify(rawToken, process.env.SECRET_KEY);

        } catch (error) {

            console.log('Token verification failed:', error.message);
        }


        const user = await usermodel.findById(decode._id);
        req.user = user;
        req.token = token;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "something is wrong"
        })
    }
}

exports.optionalAuthUser = async (req, res, next) => {

    const token = req.cookies.token ||
        (req.headers.authorization?.startsWith('Bearer ') ?
            req.headers.authorization.split(" ")[1] :
            null);


    if (!token) {
        req.user = null;

        return next();
    }

    // Check if token is blacklisted
    const istoken = await blackListTokenModel.findOne({ token });
    if (istoken) {
        req.user = null;
        req.token = null;
        return next();
    }

    try {
        let decode;
        try {
            const rawToken = token.replace(/^"|"$/g, '');
            decode = jwt.verify(rawToken, process.env.SECRET_KEY);
        } catch (error) {
            console.log('Optional token verification failed:', error.message);
            req.user = null;
            req.token = null;
            return next();
        }

        const user = await usermodel.findById(decode._id);
        if (user) {
            req.user = user;
            req.token = token;
        } else {
            req.user = null;
            req.token = null;
        }
        return next();
    } catch (error) {
        console.log('Optional auth error:', error);
        req.user = null;
        req.token = null;
        return next();
    }
}