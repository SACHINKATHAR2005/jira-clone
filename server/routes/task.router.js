import express from "express";
import { auth, isAdminorTeam } from "../middlewares/auth.middleware.js";
import { addNewTask, getAllTasks, getSingleTask, removeTask, updateTask } from "../controllers/Tasks.contoller.js";


const router = express.Router();


router.post("/create",auth,isAdminorTeam,addNewTask);
//   http://localhost:8000/task/create
router.post('/remove',auth,isAdminorTeam,removeTask);
//   http://localhost:8000/task/remove
router.put("/update/:id",auth,updateTask);
// http://localhost:8000/task/update/:id
router.get("/get-all/:projectId",auth,getAllTasks);
// // http://localhost:8000/task/get-all/:projectId
router.get("/get/:id",auth,getSingleTask);
// http://localhost:8000/task/get/:id
export default router