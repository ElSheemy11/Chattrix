import jwt from 'jsonwebtoken';

export const generateToken = (userId, res)=> {

    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '7d'
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        sameSite: 'strict', // Helps prevent CSRF attacks (Cross-Site Request Forgery)
        secure: process.env.NODE_ENV !== 'development' // Use secure cookies in production (HTTPS)
    })

    return token;
}