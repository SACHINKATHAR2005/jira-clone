import { Organization } from "../models/organization.model.js";
import { Project } from "../models/project.model.js";
import {User} from "../models/user.model.js"







export const createNewProject = async (req, res) => {
  try {
    const { name, description, organizationId } = req.body;

    if (!name || !description || !organizationId) {
      return res.status(400).json({
        message: "Please provide name, description, and organization ID",
        success: false,
      });
    }

    const Org = await Organization.findById(organizationId)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .populate({
        path: "projects",
        select: "name description createdBy",
        populate: {
          path: "createdBy",
          select: "name email role"
        }
      });

    if (!Org) {
      return res.status(400).json({
        message: "Organization not found",
        success: false,
      });
    }

 const newProject = new Project({
  name,
  description,
  organization: organizationId,
  members: [{
    user: req.user._id,
    role: "manager" 
  }],
  createdBy: req.user._id,
});

    await newProject.save();

    Org.projects.push(newProject._id);
    await Org.save();

    const populatedProject = await Project.findById(newProject._id)
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role")
      .populate("organization","name _id")

    return res.status(201).json({
      message: "Project created successfully",
      success: true,
      data: populatedProject,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
export const addnewMemberToProject = async (req, res) => {
  try {
    const { ProjectId, userId, role, OrganizationId } = req.body;

    if (!ProjectId || !userId || !role || !OrganizationId) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const organization = await Organization.findById(OrganizationId);
    if (!organization) {
      return res.status(400).json({
        message: "Organization not found",
        success: false,
      });
    }

    // If members are stored as array of { user, role }
const isUserInOrg = organization.members?.some(
  (member) => member?._id?.toString() === userId
);




    if (!isUserInOrg) {
      return res.status(400).json({
        message: "This user does not belong to the organization",
        success: false,
      });
    }

    const project = await Project.findById(ProjectId);
    if (!project) {
      return res.status(400).json({
        message: "Project not found",
        success: false,
      });
    }

    // ✅ Fix: Check from project.members, not user.members
    const isUserExist = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (isUserExist) {
      return res.status(400).json({
        message: "User already exists in the project",
        success: false,
      });
    }

    // Push the new member
    project.members.push({
      user: userId,
      role: role || "developer",
    });

    await project.save();

    const populatedProject = await Project.findById(ProjectId)
      .populate("members.user", "name email role")
      .populate("createdBy", "name email role");

    return res.status(200).json({
      message: "Member added successfully",
      success: true,
      data: populatedProject,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const removeMemberFromProject = async(req,res)=>{
    try {
        const {ProjectId,userId} = req.body;
        if(!ProjectId || !userId){
            return res.status(400).json({
                message:"all files are required !",
                success:false
            })
        }

        const project = await Project.findById(ProjectId);
        if(!project){
            return res.status(200).json({
                message:"Project not found !",
                success:false
            })
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"user not found !",
                success:false
            })
        }

       const isUserExist = project.members.some(
  (member) => member.user?._id?.toString() === userId
);

        if(!isUserExist){
            return res.status(400).json({
                message:"User not found in the project !",
                success:false
        })
        }

        project.members.pull({ user: userId });
        await project.save();

        const populatedProject = await Project.findById(ProjectId)
        .populate("members.user", "name email role")
        .populate("createdBy", "name email role");
        return res.status(200).json({
            message:"Member removed successfully",
            success:true,
            data:populatedProject
        })

    } catch (error) {
        return res.status(500).json({
            message:"internal server error",
            success:false,
            error:error.message
        })
    }
}


export const updateProjectDetails = async(req,res)=>{
    try {
        const {name,description,startDate,endDate,priority,status, progress} = req.body;
        const {id}=req.params
        if( !name || !description){
            return res.status(400).json({
                message:"all fields are required",
                success:false
            })
        }
        const project = await Project.findById(id);
        if(!project){
            return res.status(400).json({
                message:"Project not found",
                success:false

            })
        }

        const updateProject = {
            name:name || project.name,
            description:description || project.description,
            startDate:startDate || project.startDate,
            endDate:endDate || project.endDate,
            priority:priority || project.priority,
            status:status || project.status,
            progress: progress || project.progress

        }
        await Project.findByIdAndUpdate(id, updateProject, { new: true });

        const populatedProject = await Project.findById(id)
        .populate("members.user", "name email role")
        .populate("createdBy", "name email role");
        return res.status(200).json({
            message:"Project updated successfully",
            success:true,
            data:populatedProject
        })
        
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}

export const deleteProject = async(req,res)=>{
        try {
            const {id} = req.params;
            if(!id){
                return res.status(400).json({
                    message:"all files required !",
                    success:false
                })
            }

            // if(project.createdBy.toString() !== req.user._id.toString()){
            //     return res.status(404).json({
            //         message:"only owner can delete this project !",
            //         success:false
            //     })
            // }

          

            const project = await Project.findById(id);
            if(!project){
                return res.status(400).json({
                    message:"project not found !",
                    success:false
                })
            }

              if(!project.createdBy.equals(req.user._id)){
                return res.status(403).json({
                    message:"only owner can delete this project !",
                   success:false
            })
            }

            const deleteProject = await Project.findByIdAndDelete(id);

            return res.status(200).json({
                message:"proejct has deleteed !",
                success:true,
                data:deleteProject
            })

        } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}

export const getAllProjects = async(req,res)=>{
          const {orgId} = req.params;
    try {
        const getAllProjects = await Project.find({organization:orgId})
        .populate("createdBy","name email role")
        .populate("organization", 'name  ')
        .populate("members.user", "name email role")

        

        return res.status(200).json({
            message:"all project fetched succfully !",
            success:true,
            data:getAllProjects
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}

export const getSingleProject = async (req,res)=>{
    try {
        const {id} = req.params;
        const singleProject = await Project.findById(id)
        .populate("createdBy","name email role")
        .populate("organization", 'name  ')
        .populate("members.user", "name email role")

        if(!singleProject){
            return res.status(404).json({
                message:"project not found !",
                success:false
            })
        }

        return res.status(200).json({
            message:"project feteched successfully !",
            success:true,
            data:singleProject
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false,
            error:error.message
        })
    }
}