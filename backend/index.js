import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { server } from "./socket/socket.js";
import { app } from "./server.js";
dotenv.config({
    path: './.env'
})
connectDB()
.then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})