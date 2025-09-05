import jwt from 'jsonwebtoken'
import User from '../model/user.js';

export const routeProtect = async (req, res, next) => {
try{
    const token = req.cookies.jwt;

    if(!token){
        const error = new Error('User not logged in');
        error.statusCode = 401;
        return next(error)
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        const error = new Error('token invalid');
        error.statusCode = 401;
        return next(error)
    }

    console.log(decoded)

    const user = await User.findById(decoded.id);
    
    req.user = user;

    next();

}catch (error){
    next(error);
}
}