import express from "express";
import { auth, isAdminorTeam } from '../middlewares/auth.middleware.js';
import { addnewMemberToProject, createNewProject, deleteProject, getAllProjects, getSingleProject, removeMemberFromProject, updateProjectDetails } from "../controllers/project.controller.js";

const router = express.Router();


router.post("/create",auth,isAdminorTeam,createNewProject);
//  https://jira-clone-u2r9.onrender.com/project/create

router.post("/add-member",auth,isAdminorTeam,addnewMemberToProject);
// https://jira-clone-u2r9.onrender.com/project/add-member
router.post("/remove-member",auth,isAdminorTeam,removeMemberFromProject);
// https://jira-clone-u2r9.onrender.com/project/remove-member
router.put("/update/:id",auth,isAdminorTeam,updateProjectDetails);
//  https://jira-clone-u2r9.onrender.com/project/update/:id
router.delete("/delete/:id",auth,isAdminorTeam,deleteProject);
//  https://jira-clone-u2r9.onrender.com/project/delete/:id
router.get("/get-all/:orgId",auth,getAllProjects);
//  https://jira-clone-u2r9.onrender.com/project/get-all/:orgId
router.get("/get/:id",auth,getSingleProject);
// https://jira-clone-u2r9.onrender.com/project/get/:id




export default router;