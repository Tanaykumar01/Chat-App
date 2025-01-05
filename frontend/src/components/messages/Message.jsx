import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../store/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const isMine = message.senderId === authUser.data.user._id;
  const chatClassName = isMine ? "chat-end" : "chat-start";
  const profilePic = isMine
    ? authUser.data.user.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = isMine ? "bg-blue-500" : "";
  const shouldShake = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="avatar" />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shouldShake} pb-2`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {extractTime(message.createdAt)}
      </div>
    </div>
  );
};

export default Message;
