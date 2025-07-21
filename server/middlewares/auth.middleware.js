import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";




export const auth =async(req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized",
                success:false
            })
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decode.id).select("_id role email name");
        if(!user){
            return res.status(401).json({
                message:"Unauthorized",
                success:false
            })
        }
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}


export const isAdmin =(req,res,next)=>{
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({
                message:"You are not authorized",
                success:false
            })
        }
        next();
        
    } catch (error) {
        return res.status(500).json({
            message:' Internal server error',
            success:false,
            error:error.message
        })
    }
}

export const isAdminorTeam = (req,res,next)=>{
    try {
        if(req.user.role !== "admin" && req.user.role !== "team-lead"){
            return res.status(403).json({
                message:"You are not authorized",
                success:false
            })
        }
        next();
        
    } catch (error) {
        return res.status(500).json({
            message:" Internal server error",
            success:false,
        })
    }
}