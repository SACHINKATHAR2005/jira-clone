import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUser = async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;
        if(!email ||!password){
            return res.status(400).json({
                message:"Please provide email and password",
                success:false
            })
        }
        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({
                message:`${existUser.name} is already registred`,
                success:false
            })}

        const hashPassword = await bcrypt.hash(password,10);
        const newUser = await User({
            name,
            email,
            password:hashPassword,
            role :role || "user",
           
        })
        
        await newUser.save();
        return res.status(201).json({
            message:`${newUser.name} is registered successfully`,
            success:true,
            data:newUser
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}

export const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"Please provide email and password",
                success:false
            })
        }
        const existUser = await User.findOne({email});
        if(!existUser){
            return res.status(400).json({
                message:"User not found",   
                success:false,
                
            })
        }

        const decryptPassword = await bcrypt.compare(password,existUser.password);
        if(!decryptPassword){
            return res.status(400).json({
                message:"Invalid password",
                success:false
            })
        }
        const token = jwt.sign({
            id:existUser._id,
            name:existUser.name,
            email:existUser.email,
            role:existUser.role
        },process.env.JWT_SECRET,{
            expiresIn:"1hr"
        })

        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:1000*60*60,

        })

        return res.status(200).json({
            message:`${existUser.name} logged in successfully`,
            success:true,
            Token : token,
            data:{
                name:existUser.name,
                email:existUser.email,
                role:existUser.role,
                orgId:existUser.organization,
                projectId:existUser.projectIds,
                avtar:existUser.avtar,
                isVerified :existUser.isVerified,
            }

        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message

        })
    }
}


export const logoutUser = async(req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message:`Logged out successfully`,
            success:true
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"internal server error",
            success:false,
            error:error.message
        })
    }
}



export const getAllUser = async(req,res)=>{
    try {
        const users = await User.find({}).select("id name email role organization isVerified projectIds ");
        return res.status(200).json({
            message:"All users",
            success:true,
            data:users
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
        
    }
}