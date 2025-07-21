import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  type: {
    type: String,
    enum: ['bug', 'feature', 'task', 'other'],
    default: 'task'
  },

  status: {
    type: String,
    enum: ['todo', 'in-progress', 'in-review', 'completed', 'blocked'],
    default: 'todo'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  assignedDate: {
    type: Date,
    default: Date.now
  },

  dueDate: Date, 

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },

  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment' 
  }]
}, { timestamps: true }); 


export const Task = mongoose.model("Task",TaskSchema);
