const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config('../.env');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    Fullname: {
        Firstname: {
            type: String,
            required: true
        },
        Lastname: {
            type: String,
            required: true
        }
    },
    Email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address"
        ],
        trim: true,
        lowercase: true
    },
    Password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [100, "Password must be at most 100 characters long"],

    },
    Phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [
            /^\d{10}$/,
            "Please provide a valid phone number"
        ]
    },
    Skills: {
        type: [String],
    },
    Education: {
        type: String,

    },
    ProfilePhoto: {
        type: String
    }
    ,
    Points: {
        type: Number,
        default: 0
    },

    socketId: {
        type: String,
        default: null
    },

}, {
    timestamps: true
});
userSchema.methods.generateAuthToken = function () {

    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
    return token;
}
userSchema.methods.comparepassword = async function (password) {
    return await argon2.verify(this.Password, password);
}
userSchema.statics.hashpassword = async function (password) {
    return await argon2.hash(password);
}
const usermodel = mongoose.model("User", userSchema);
module.exports = usermodel;
