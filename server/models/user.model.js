import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trime: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trime: true
    },
    password: {
        type: String,
        required: true,
        trime: true
    },
    role:{
        type:String,
        enum:["user","team-lead","admin"],
        default:"user"
    },
    organization:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        default: null 
    }],
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    avtar:{
        type:String,
        default:""
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    

}, { timestamps: true });



export const User = mongoose.model("User", userSchema)