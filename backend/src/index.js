import e from 'express';

import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js'; // We should attach extinction .js to import path as we are using ES6 modules

import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js'

import cors from 'cors';

import { app, server } from './lib/socket.js';

import path from 'path';



dotenv.config();

const PORT = process.env.PORT ;
const __dirname = path.resolve();

app.use(e.json({limit:'10mb'}));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
}))

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(e.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    })

}


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})