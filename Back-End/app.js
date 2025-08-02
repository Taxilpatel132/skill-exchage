const express = require('express');
const app = express();
const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const courseRoutes = require('./routes/course.route');
const cookieparser = require("cookie-parser");
app.use(express.json());
app.use(cookieparser());
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/course', courseRoutes);
module.exports = app;