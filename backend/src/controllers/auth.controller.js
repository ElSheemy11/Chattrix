import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if ( !email || !fullName || !password ) {
            return res.status(400).json({ message : "All fields are required"})

        }
        if (password.length < 6) {
            return res.status(400).json({ message : "Password must be at least 6 characrters long"})
        }
        const user = await User.findOne({ email })

        if(user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        
        if ( newUser ){ 
            // Foooog You have to generate a token here and send it back to the user
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                message: "User created successfully" 
            });
         }else {
            res.status(400).json({ message: "Invalid user data" })
         }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    if ( !email || !password ) {
        return res.status(400).json({ message: "All fields are required!" })
    }
    try {
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if ( !isPasswordCorrect ) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = generateToken(user._id, res);

        res.status(200).json({
            message: "Login successful",
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        // res.clearCookie("token"); // This is also a valid way to clear the cookie
        // but make sure to match the cookie options like domain, path, etc.
        res.status(200).json({ message: "Logged Out Successfully" })
    } catch (error) {
        console.log("Error in logout controller:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required!" })
        }

        const uploadResponce  = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId, { profilePic:uploadResponce.secure_url }, { new:true }
        )

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in updateProfile controller:", error)
        res.status(500).json({ message: "Internal server error" })

    }
}
export const checkAuth = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        res.status(200).json( req.user );
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}