const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const courseRoutes = require('./routes/course.route');
const searchRoutes = require('./routes/search.route');
const notificationRoutes = require('./routes/notification.route');

const cookieparser = require("cookie-parser");

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
    credentials: true,  // Important for cookies/auth
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/course', courseRoutes);
app.use('/search', searchRoutes);
app.use('/notifications', notificationRoutes);

module.exports = app;