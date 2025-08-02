const jwt = require("jsonwebtoken");
const usermodel = require("../models/users.model");
const adminModel = require("../models/admin.model");
const blackListTokenModel = require("../models/blacklisttoken.model");
exports.authUser = async (req, res, next) => {
    // console.log(req.headers);
    //console.log(req.cookies);
    const token = req.cookies.token ||
        (req.headers.authorization?.startsWith('Bearer ') ?
            req.headers.authorization.split(" ")[1] :
            null);
    //console.log("from auth user", token);
    if (!token) {
        //console.log("no token");
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

exports.authAdmin = async (req, res, next) => {
    const token = req.cookies.token ||
        (req.headers.authorization?.startsWith('Bearer ') ?
            req.headers.authorization.split(" ")[1] :
            null);
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
        const admin = await adminModel.findById(decode._id);
        req.admin = admin;
        req.token = token;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "something is wrong"
        })
    }
}