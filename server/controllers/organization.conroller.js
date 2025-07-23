import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";


export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.user;

    if (!name || !description) {
      return res.status(400).json({
        message: "Please provide name and description",
        success: false,
      });
    }

    // 1️⃣ Create new organization
    const newOrganization = new Organization({
      name,
      description,
      createdBy: user._id,
      members: [user._id],
    });

    await newOrganization.save();

    // 2️⃣ Update user's organization field
    await User.findByIdAndUpdate(user._id, {
      organization: newOrganization._id,
    });

    // 3️⃣ Re-fetch org with populated users
    const populatedOrg = await Organization.findById(newOrganization._id)
      .populate("createdBy", "name email role organization isVerified projectIds")
      .populate("members", "name email role organization isVerified projectIds");

    return res.status(201).json({
      message: "Organization created successfully",
      success: true,
      data: populatedOrg,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const addNewMember = async (req, res) => {
  try {
    const { OrganizationId, userId } = req.body;
    const user = req.user;

    if (!OrganizationId || !userId) {
      return res.status(400).json({
        message: "Please provide organization id and user id",
        success: false,
      });
    }

    const organization = await Organization.findById(OrganizationId)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
        success: false,
      });
    }

    const existUser = await User.findById(userId);
    if (!existUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const userAlreadyMember = organization.members.some(
      (member) => member._id.toString() === userId
    );

    if (userAlreadyMember) {
      return res.status(400).json({
        message: "User is already a member of this organization",
        success: false,
      });
    }

    // 1️⃣ Add user to organization
    organization.members.push(userId);
    await organization.save();

    // 2️⃣ Update user's organization field
    await User.findByIdAndUpdate(userId, {
      organization: OrganizationId,
    });

    // 3️⃣ Get updated organization info
    const updatedOrg = await Organization.findById(OrganizationId)
      .populate("createdBy", "name email role organization projectIds isVerified")
      .populate("members", "name email role organization projectIds isVerified");

    return res.status(200).json({
      message: "User added successfully",
      success: true,
      data: updatedOrg,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { organizationId, userId } = req.body;

    if (!organizationId || !userId) {
      return res.status(400).json({
        message: "Organization ID and User ID are required",
        success: false,
      });
    }

    const organization = await Organization.findById(organizationId)
      .populate("createdBy", "name email role organization isVerified projectIds")
      .populate("members", "name email role organization isVerified projectIds");

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
        success: false,
      });
    }

    const existUser = await User.findById(userId);
    if (!existUser) {
      return res.status(404).json({
        message: "User does not exist!",
        success: false,
      });
    }

    // 🚫 Protect org owner
    if (organization.createdBy._id.toString() === userId) {
      return res.status(403).json({
        message: "You cannot remove the organization owner.",
        success: false,
      });
    }

    // ✅ Member check (works whether populated or not)
    const isMember = organization.members.some((member) => {
      const memberId = typeof member === "object" ? member._id.toString() : member.toString();
      return memberId === userId;
    });

    if (!isMember) {
      return res.status(400).json({
        message: "User is not a member of this organization",
        success: false,
      });
    }

    // ✅ Remove user
    organization.members.pull(userId);
    await organization.save();

    const updatedData = await Organization.findById(organizationId)
      .populate("createdBy", "name email role organization isVerified projectIds")
      .populate("members", "name email role organization isVerified projectIds");

    return res.status(200).json({
      message: `${existUser.name} removed from the organization successfully`,
      success: true,
      data: updatedData,
    });

  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


export const updateOrganization = async(req,res)=>{
  try {
    const {name,description} = req.body;
    const id = req.params.id;
    
    if(!id || !name || !description){
      return res.status(400).json({
        message:"Please provide organization id, name and description",
        success:false

      })
    } 
    const organization = await Organization.findById(id);
    if(!organization){
      return res.status(404).json({
        message:"Organization not found",
        success:false
      })
    }
    const updateData ={
      name,description
    }


    organization.name = updateData.name;
    organization.description = updateData.description;
    await organization.save();

      const upadtedOrg = await Organization.findById(id)
      .populate("createdBy", "name email role organization isVerified projectIds")
      .populate("members", "name email role organization isVerified projectIds");

    return res.status(200).json({
      message:"Organization update successfully",
      success:true,
      data :upadtedOrg
    })
  } catch (error) {
    return res.status(500).json({
      message:"Internal server error",
      success:false,
      error:error.message
    })
  }
}


export const deleteOrganization = async(req,res)=>{
  try {
    const {id} = req.params;
    if(id){
      return res.status(400).json({
        message:"Please provide organization id",
        success:false
      })
    }
    const organization = await Organization.findById(id);
    if(!organization){
      return res.status(404).json({
        message:"Organization id is not valid !",
        success:false
      })
    }

    if(organization.createdBy.toString() !== req.user._id.toString()){
      return res.status(403).json({
        message:"Only owner can delete this Organization ",
        success:false
      })
    }

    const deleteOrg = await organization.remove()

    return res.status(200).json({
      message:`${organization.name} is delete by ${req.user.name}`,
      success:true,
      data :deleteOrg
    })

    
  } catch (error) {
    return res.status(500).json({
      message:"internal server error",
      success:false
    })
  }
}
export const getAllOrganization = async (req, res) => {
  try {
    const organizations = await Organization.find({})
      .populate("createdBy", "name email role organization isVerified projectIds ")
      .populate("members", "name email role organization isVerified projectIds")
      .populate("projects", "name _id");

    return res.status(200).json({
      message: "All organizations fetched successfully!",
      success: true,
      data: organizations
    });
  } catch (error) {
    console.error("Get all orgs error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const getSingleOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Organization ID is required!",
        success: false
      });
    }

    const organization = await Organization.findById(id)
      .populate("createdBy", "name email role organization isVerified projectIds")
      .populate("members", "name email role organization isVerified projectIds")
      .populate("projects", "name _id");

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found!",
        success: false
      });
    }

    return res.status(200).json({
      message: `${organization.name} fetched successfully!`,
      success: true,
      data: organization
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};
