import express from "express";

import { registerUser,loginUser,logoutUser,getAllUser } from "../controllers/user.controller.js";

import { auth, isAdmin } from "../middlewares/auth.middleware.js"; 

const router = express.Router();


router.post("/register", registerUser);
//   http://localhost:8000/auth/register
router.post("/login", loginUser);

// http://localhost:8000/auth/login
router.post("/logout", logoutUser);
//http://localhost:8000/auth/logout

router.get("/all-user", auth, isAdmin,getAllUser);
// http://localhost:8000/auth/all-user
export default router;
