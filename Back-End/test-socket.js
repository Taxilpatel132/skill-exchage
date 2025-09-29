// Simple test script to verify Socket.io setup
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Test client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Test client disconnected:', socket.id);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Test Socket.io server running on port ${PORT}`);
    console.log('You can test the connection by running:');
    console.log('node test-socket.js');
});
