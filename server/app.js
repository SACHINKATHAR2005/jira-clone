import dotenv from "dotenv";
dotenv.config()
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./db/db.js"
import userRouter from "./routes/user.router.js"
import organizationRouter from "./routes/organization.router.js";
import projectRouter from "./routes/project.router.js"
import taskRouter from "./routes/task.router.js"

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true

}))

app.use("/auth",userRouter);
app.use("/org",organizationRouter);
app.use("/project",projectRouter);
app.use("/task",taskRouter);

const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`server is running on the port ${port}`);
})


