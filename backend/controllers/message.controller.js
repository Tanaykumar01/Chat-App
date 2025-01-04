import Message from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const sendMessage = asyncHandler (async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id } = req.params;
        const newMessage = new Message({
            senderId: req.user._id,
            receiverId: id,
            message
        });
        await newMessage.save();
        res.status(201).json(
            new ApiResponse(201, newMessage, "Message sent successfully")
        );
    } catch (error) {
        next(error);
    }
});