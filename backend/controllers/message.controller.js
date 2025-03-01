import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const sendMessage = AsyncHandler (async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id : receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([newMessage.save(), conversation.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

        res.status(201).json(
            new ApiResponse(201, newMessage, "Message sent successfully")
        );
    } catch (error) {
        console.log("Error in sendMessage route :- ", error.message);
        res.status(500).json(
            new ApiResponse(500, null, "An error occurred while sending message")
        );
    }
});

export const getMessages = AsyncHandler(async (req, res, next) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json(
                new ApiResponse(200, [], "No messages found")
            );
        }
        const message = conversation.messages;
        res.status(200).json(
            new ApiResponse(200, message, "Messages fetched successfully")
        );

    } catch (error) {
        console.log("Error in getMessages route :- ", error.message);
        res.status(500).json(
            new ApiResponse(500, null, "An error occurred while fetching messages")
        );
    }
});