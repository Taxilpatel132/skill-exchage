const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config('./.env');
const dbURI = process.env.MONGO_URL;
const connectDB = async () => {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully');
}
module.exports = connectDB;