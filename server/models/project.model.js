import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["developer", "tester", "designer", "manager", "qa", "other"],
            required: true
        }
    }],

    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    status: {
        type: String,
        enum: ["active", "completed", "on-hold"],
        default: "active"
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    progress: {
        type: Number,
        default: 0
    }


}, { timestamps: true })


export const Project = mongoose.model("Project", projectSchema);