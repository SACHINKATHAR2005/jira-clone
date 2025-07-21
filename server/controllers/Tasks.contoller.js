
import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/tasks.model.js";
import { Project } from "../models/project.model.js";




export const addNewTask = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      priority,
      dueDate,
      projectId,
      OrgId,
      userId
    } = req.body;

    if (!name || !type || !priority || !dueDate || !projectId || !OrgId) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const organization = await Organization.findById(OrgId);
    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
        success: false,
      });
    }

const project = await Project.findById(projectId)
  .populate("members.user", "name email role");

const isUserInProj = project.members.some(
  (member) => member?.user?._id?.toString() === userId
);

    if(!isUserInProj){
      return res.status(400).json({
        message:"this user is not in the project",
        success:false
      })
    }

    const user = await User.findById(userId)
    if(!user){
      return res.status(400).json({
        message:"user is not found",
        success:false
      })
    }
    const newTask = new Task({
      name,
      description,
      type,
      priority,
      dueDate,
      org: OrgId,
      project: projectId,
      createdBy: req.user._id,
      assignedTo: userId,
      assignedDate: new Date(),
    });

    await newTask.save();

    project.tasks.push(newTask._id); // ✅ Correct usage
    await project.save();

    const populatedTask = await Task.findById(newTask._id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("project", "name description createdBy")
      .populate("org", "name description createdBy members projects");

    return res.status(201).json({
      message: "Task created successfully",
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const removeTask = async (req, res) => {
  try {
    const { TaskId, ProjectId, OrgId } = req.body;

    if (!TaskId || !ProjectId || !OrgId) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }

    const task = await Task.findById(TaskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found!",
        success: false,
      });
    }

    const project = await Project.findById(ProjectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found!",
        success: false,
      });
    }

    const organization = await Organization.findById(OrgId);
    if (!organization) {
      return res.status(404).json({
        message: "Organization not found!",
        success: false,
      });
    }

    project.tasks.pull(TaskId);
    await project.save();

    
    await Task.findByIdAndDelete(TaskId);

    
    const updatedProject = await Project.findById(ProjectId)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .populate({
        path: "tasks",
        populate: {
          path: "createdBy",
          select: "name email role",
        },
      });

    return res.status(200).json({
      message: "Task removed successfully",
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateTask = async(req,res)=>{
  try {
    const {
      name,
      description,
      type,
      priority,
      dueDate,
      status,
      projectId,
      OrgId,
      TaskId
    } = req.body;

    if(!projectId || !OrgId || !TaskId){
      return res.status(400).json({
        message:"plz check the project or organization !",
        success:false
      })
    }
    if(!name|| !description){
      return res.status(400).json({
        message:"name & description are needed !",
        success:false
      })
    }

    const organization = await Organization.findById(OrgId)
    if(!organization){
      return res.status(400).json({
        message:"organization not found !",
        success:false
      })
    }

    const project = await Project.findById(projectId);
    if(!project){
      return res.status(400).json({
        message:"project is not found !",
        success:false
      })
    }

    const task = await Task.findById(TaskId);
    if(!task){
      return res.status(400).json({
        message:"task is not found !",
        success:false
      })
    }

    if(req.user.role === "admin" || req.user.role === "team-lead"){
      await Task.findByIdAndUpdate(TaskId,{
      name:name || task.name,
      description:description || task.description,
      type:type || task.type,
      priority:priority|| task.priority,
       status: status ||task. status,
      dueDate:dueDate || task.dueDate,
     },{new:true});
    }else{
      if(req.user.role === "user"){
         await Task.findByIdAndUpdate(TaskId,{
           status: status|| task. status
         })
      }else{
        return res.status(400).json({
          message:"User update task !",
          success:false
        })
      }
    }

     

    const updatedTask = await Task.findById(TaskId)
    .populate("createdBy", "name email role")
    .populate("assignedTo" ,"name email role")
    .populate("project","name")
    .populate("org","name")

    return res.status(200).json({
      message:"task update !",
      success:true,
      data:updatedTask
    })
  } catch (error) {
    return res.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
}


export const getAllTasks= async(req,res)=>{
  try {
    const {projectId} = req.params
    const getAllTasks = await Task.find({project:projectId})
    .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("project", "name description createdBy")
      .populate("org", "name description createdBy members projects");
    
    return res.status(200).json({
      message:"all tasks are feteched !",
      success:true,
      data:getAllTasks
    })

    
  } catch (error) {
    return res.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
}

export const getSingleTask = async(req,res)=>{
  try {
    const {id}= req.params;
    const task = await Task.findById(id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("project", "name description createdBy")
      .populate("org", "name description createdBy members projects");
    if(!task){
      return res.status(400).json({
        message:"task not found !",
        success:false
      })
    }
    
    return res.status(200).json({
      message:"task feteched !",
      success:true,
      data:task
    })

  } catch (error) {
    return res.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
}