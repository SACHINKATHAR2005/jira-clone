import express from "express";
import { createOrganization,addNewMember,removeMember,updateOrganization,deleteOrganization,getAllOrganization,getSingleOrganization } from "../controllers/organization.conroller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { isAdminorTeam } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.use(auth);


router.post("/create", createOrganization);


router.post("/add-member", isAdminorTeam, addNewMember);


router.post("/remove-member", isAdminorTeam, removeMember);


router.put("/update", isAdminorTeam, updateOrganization);


router.delete("/delete", deleteOrganization);


router.get("/all", getAllOrganization);


router.get("/:id", getSingleOrganization);

export default router;
