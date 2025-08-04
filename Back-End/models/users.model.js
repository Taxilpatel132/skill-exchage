const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config('../.env');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        }
    },
    email: {
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
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [100, "Password must be at most 100 characters long"],
        selete: false

    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [
            /^\d{10}$/,
            "Please provide a valid phone number"
        ]
    },
    skills: {
        type: [String],
    },
    education: {
        type: String,

    },
    profilePhoto: {
        type: String
    }
    ,
    points: {
        type: Number,
        default: 0
    },

    socketId: {
        type: String,
        default: null
    },
    bio: {
        type: String,

    }

}, {
    timestamps: true
});
userSchema.methods.generateAuthToken = function () {

    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
    return token;
}
userSchema.methods.comparePassword = async function (password) {
    return await argon2.verify(this.password, password);
}
userSchema.statics.hashPassword = async function (password) {
    return await argon2.hash(password);
}
const usermodel = mongoose.model("User", userSchema);
module.exports = usermodel;
