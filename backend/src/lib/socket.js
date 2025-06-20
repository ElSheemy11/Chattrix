import { Server } from "socket.io";
import http from "http";
import e from "express";

const app = e();

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]

    }
})

export function getRecieverSocketId(userId) {
    return userSocketMap[userId];
} 

// storing online users
const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
    if (!userSocketMap[userId]) userSocketMap[userId] = [];
    userSocketMap[userId].push(socket.id);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
} else {
    console.warn("Socket connected without valid userId!", socket.id);
}

    socket.on("disconnect",() => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })
    socket.on("join", ({ chatId }) => {
        console.log("Socket joined room:", chatId, socket.id);
    socket.join(chatId);
    
    // Add this to see how many sockets are in the room
    const roomSize = io.sockets.adapter.rooms.get(chatId)?.size || 0;
    console.log(`Room ${chatId} now has ${roomSize} sockets`);
    });
    socket.on("typing", ({ chatId, sender, data }) => {
    
    socket.to(chatId).emit("display typing", `${sender} is typing...`);
});
    socket.on("stop typing", ({ chatId }) => {
        console.log("Received stop typing for chatId:", chatId);
        socket.to(chatId).emit("remove typing");
    })
})

export {io, app, server};