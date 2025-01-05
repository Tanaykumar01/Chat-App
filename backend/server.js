import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app } from "./socket/socket.js";

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true,
// }));

const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "50mb",
}));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.use(cookieParser());


// import routes
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import userRouter from "./routes/user.routes.js";
// use routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/users", userRouter);

app.get("*" , (req,res) => {
    res.sendFile(path.join(__dirname, "frontend" , "dist" , "index.html"));
})

export { app };