import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"], 
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String], // Array of image URLs or base64 strings
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const thumbnailChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true,
    },
    messages: {
      type: [messageSchema], // Embedding messages inside the chat
      default: [],
    }
  },
  { timestamps: true }
);

const ThumbnailChat =  mongoose.model("ThumbnailChat", thumbnailChatSchema);

export default ThumbnailChat;
