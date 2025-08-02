const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const adminSchema = new mongoose.Schema({
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

});


adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
    return token;
}

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;