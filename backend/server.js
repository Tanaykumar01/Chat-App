// server.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import userRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
// use routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/message", messageRouter);

export { app };