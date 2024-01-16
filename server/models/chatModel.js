import mongoose from "mongoose";
const chatSchema = mongoose.Schema(
  {
    photo: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9790/9790561.png",
    },
    chatName: {
      type: String,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    joiningDate: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
