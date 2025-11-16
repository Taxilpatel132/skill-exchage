let dotenv = require('dotenv');
dotenv.config();

let http = require('http');


let app = require('./app');


const connectDB = require('./database/db');


const { Server } = require('socket.io');


const jwt = require('jsonwebtoken');
const User = require('./models/users.model');




let port = process.env.PORT || 3000;
let server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const connectedUsers = new Map();

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return next(new Error('User not found'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Store user connection
    connectedUsers.set(socket.userId, socket);
    
    // Join user to their personal room
    socket.join(`user_${socket.userId}`);
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        connectedUsers.delete(socket.userId);
    });
    
    // Handle joining specific rooms (e.g., course discussions)
    socket.on('join_course', (courseId) => {
        socket.join(`course_${courseId}`);
        console.log(`User ${socket.userId} joined course ${courseId}`);
    });
    
    // Handle leaving course rooms
    socket.on('leave_course', (courseId) => {
        socket.leave(`course_${courseId}`);
        console.log(`User ${socket.userId} left course ${courseId}`);
    });
});


app.set('io', io);


const startServer = async () => {
    try {
        await connectDB();
        server.listen(port, () => {
            console.log(`✅ Server is running on port ${port}`);
            console.log(`✅ Socket.io server is running`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
