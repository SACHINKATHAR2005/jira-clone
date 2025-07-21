import mongoose from "mongoose";

 export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to the database");
        
    } catch (error) {
        return console.error("Error connecting to the database:", error);
    }
}