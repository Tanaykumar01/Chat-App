import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const getUserForSideBar = AsyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUser } }).select("-password -refreshToken");
        res.status(200).json(
            new ApiResponse(200, users, "Users fetched successfully")
        );
    } catch (error) {
        console.log("Error in getUserForSideBar route :- ", error.message);
        res.status(500).json(
            new ApiResponse(500, null, "An error occurred while fetching user for sidebar")
        );
    }
})