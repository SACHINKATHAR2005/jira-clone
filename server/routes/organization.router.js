import express from "express";
import { createOrganization,addNewMember,removeMember,updateOrganization,deleteOrganization,getAllOrganization,getSingleOrganization } from "../controllers/organization.conroller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { isAdminorTeam } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.use(auth);


router.post("/create", createOrganization);

 // https://jira-clone-u2r9.onrender.com/org/create
router.post("/add-member", isAdminorTeam, addNewMember);
 // https://jira-clone-u2r9.onrender.com/org/add-member
router.post("/remove-member", isAdminorTeam, removeMember);

 // https://jira-clone-u2r9.onrender.com/org/remove-member

router.put("/update/:id", isAdminorTeam, updateOrganization);

 // https://jira-clone-u2r9.onrender.com/org/update/:id

router.delete("/delete/id", isAdminorTeam,deleteOrganization);

 // https://jira-clone-u2r9.onrender.com/org/delete/id

router.get("/all",isAdminorTeam ,getAllOrganization);

 // https://jira-clone-u2r9.onrender.com/org/all

router.get("/:id", getSingleOrganization);

 // https://jira-clone-u2r9.onrender.com/org/:id
export default router;
