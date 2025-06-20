import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Assuming req.user is populated by the auth middleware
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fethcing users for sidebar:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id : userToChatId } = req.params;
        const myId = req.user._id; // Assuming req.user is populated by the auth middleware
        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params;
        const  senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload image to cloudinary and get Url
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({ 
            senderId,
            recieverId,
            text,
            image: imageUrl,
         });

        await newMessage.save();
         
         const recieverSocketId = getRecieverSocketId(recieverId);
         if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
         }

         res.status(200).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}