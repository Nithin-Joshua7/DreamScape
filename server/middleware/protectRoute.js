import jwt from "jsonwebtoken"
import ENV_VARS from "../utils/envars.js"
import User from "../models/usermodel.js"


const protectRoute = async (req,res,next)=>{

    try {
        const token = req.cookies["jwt"]

        if(!token)
            return res.status(400).json({message:"Unauthorized no token provided"})
    
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET)
    
        if(!token)
            return res.status(400).json({message:"invalid token"})
    
        const user = await User.findById(decoded.id).select("-password")
        console.log(user);
    
        if(!user)
            return res.status(400).json({message:"user not found"})
    
        req.user = user
    
        next()
    } 
    
    catch (error) {
        
        console.log(`Error in protectRoute middleware ${error}`);
        res.status(400).json({message:"internal server error"})
    }
   
} 

export default protectRoute