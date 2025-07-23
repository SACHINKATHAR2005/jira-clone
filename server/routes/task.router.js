import express from "express";
import { auth, isAdminorTeam } from "../middlewares/auth.middleware.js";
import { addNewTask, getAllTasks, getSingleTask, removeTask, updateTask } from "../controllers/Tasks.contoller.js";


const router = express.Router();


router.post("/create",auth,isAdminorTeam,addNewTask);
//   https://jira-clone-u2r9.onrender.com/task/create
router.post('/remove',auth,isAdminorTeam,removeTask);
//   https://jira-clone-u2r9.onrender.com/task/remove
router.put("/update/:id",auth,updateTask);
// https://jira-clone-u2r9.onrender.com/task/update/:id
router.get("/get-all/:projectId",auth,getAllTasks);
// //https://jira-clone-u2r9.onrender.com/task/get-all/:projectId
router.get("/get/:id",auth,getSingleTask);
//https://jira-clone-u2r9.onrender.com/task/get/:id
export default router