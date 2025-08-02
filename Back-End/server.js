let dotenv = require('dotenv');
dotenv.config('./.env');
let http = require('http');
let app = require('./app');
const connectDB = require('./database/db');
let port = process.env.PORT || 3000;
let server = http.createServer(app);
connectDB();
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
