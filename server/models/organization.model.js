import mongoose from "mongoose";


const organizationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }]
},{timestamps:true})

export const Organization = mongoose.model("Organization", organizationSchema)