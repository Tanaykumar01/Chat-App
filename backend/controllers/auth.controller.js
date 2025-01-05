import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
const signup = asyncHandler(async (req, res) => {
    try {
        const { name, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            throw new ApiError(400, "Passwords do not match");
        }

        const existedUser = await User.findOne({ username });
        if (existedUser) {
            throw new ApiError(400, "Username already exists");
        }

        // hash password
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const user = new User({
            name,
            username,
            password,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girProfilePic,
        });

        await user.save();

        const UserResponse = await User.findById(user._id).select("-password -refreshToken");
        if (!UserResponse) {
            throw new ApiError(500, "Error in creating user");
        }
        console.log("User registered successfully");
        return res.status(201).json(
            new ApiResponse(200, UserResponse, "User registered Successfully")
        )
        
    } catch (error) {
        console.log("Error in signup route :- ", error.message);
        res.status(500).json(
            new ApiResponse(500, null, error.message)
        );
    }
});

const login = asyncHandler (async (req, res) => {
    try {
        const { username , password } = req.body;
        const user = await User.findOne({ username });
        if(!user){
            throw new ApiError(400 , "User not found");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            throw new ApiError(400 , "Invalid credentials");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
        const options = {
            httpOnly : true,
            secure : true
        }
        console.log("User logged in successfully");
        res.status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , refreshToken , options)
        .json(
            new ApiResponse(200 , {
                user : loggedInUser,
                accessToken,
                refreshToken
            }, "User logged in successfully")
        );
    } catch (error) {
        console.log("Error in login route :- ", error.message);
        res.status(500).json(
            new ApiResponse(500 , null , error.message)
        )
    }


})

const logout = asyncHandler( async (req, res) => {
    try {
        const user = req.user;
        user.refreshToken = "";
        await user.save();
        res.status(200).json(
            new ApiResponse(200 , null , "User logged out successfully")
        )
    } catch (error) {
        console.log("Error in logout route :- ", error.message);
        res.status(500).json(
            new ApiResponse(500 , null , "An error occurred while logout")
        )
    }
})

export { signup, login, logout }