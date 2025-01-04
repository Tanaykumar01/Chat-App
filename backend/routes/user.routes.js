import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getUserForSideBar } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(verifyJWT,getUserForSideBar);

export default router;