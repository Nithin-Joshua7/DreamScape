import jwt from "jsonwebtoken"
import ENV_VARS from "./envars.js";

const generateToken = async(id,res)=>{
    const token = jwt.sign({id},ENV_VARS.JWT_SECRET,{
        expiresIn:"15d"
    })
    res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, 
		httpOnly: true, 
		sameSite: "strict", 
		secure: ENV_VARS.NODE_ENV !== "development",
	});
    return token
}

export default generateToken