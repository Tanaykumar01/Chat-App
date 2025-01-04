import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./server.js";
dotenv.config({
    path: './.env'
})
connectDB()
.then(() => {
    app.listen(process.env.PORT || 6000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})