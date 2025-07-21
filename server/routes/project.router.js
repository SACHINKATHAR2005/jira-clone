import express from "express";
import { auth, isAdminorTeam } from '../middlewares/auth.middleware.js';
import { addnewMemberToProject, createNewProject, deleteProject, getAllProjects, getSingleProject, removeMemberFromProject, updateProjectDetails } from "../controllers/project.controller.js";

const router = express.Router();


router.post("/create",auth,isAdminorTeam,createNewProject);
// http://localhost:8000/project/create

router.post("/add-member",auth,isAdminorTeam,addnewMemberToProject);
// http://localhost:8000/project/add-member
router.post("/remove-member",auth,isAdminorTeam,removeMemberFromProject);
//  http://localhost:8000/project/remove-member
router.put("/update/:id",auth,isAdminorTeam,updateProjectDetails);
//  http://localhost:8000/project/update/:id
router.delete("/delete/:id",auth,isAdminorTeam,deleteProject);
//  http://localhost:8000/project/delete/:id
router.get("/get-all/:orgId",auth,getAllProjects);
//  http://localhost:8000/project/get-all/:orgId
router.get("/get/:id",auth,getSingleProject);
//  http://localhost:8000/project/get/:id




export default router;