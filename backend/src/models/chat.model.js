import mongoose from "mongoose";


 
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true,
    },
    title : {
        type : String,
        default : "Untitled"
    }
  },
  { timestamps: true }
);

const Chat =  mongoose.model("Chat", ChatSchema);

export default Chat;
