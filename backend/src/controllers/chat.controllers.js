import Chat from "../models/chat.model.js";
import {   getAuth } from '@clerk/express'
import User from "../models/user.model.js";
import ThumbnailChat from "../models/thumbnailChat.model.js";

export const createChat = async (req , res)=>{
    try {
         const { userId } = getAuth(req, { acceptsToken: 'any' })
        if(!userId) {
            return res.status(400).json({
                success: false , 
                message : "Unauthorized"
            })
        }
        const user = await User.findOne({clerkId : userId});
        const chat = await Chat.create({
            userId : user._id
        })

        return res.status(200).json({
            success : true ,
            message : "New chat created",
            chat
        })
        
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
                success: false , 
                message : "Unable to create a chat"
            })
        
    }

}
export const getChat = async (req , res)=>{
    try {
         const { userId } = getAuth(req, { acceptsToken: 'any' }) 
        if(!userId) {
            return res.status(400).json({
                success: false , 
                message : "Unauthorized"
            })
        }

        const user = await User.findOne({clerkId : userId});

        const chat = await Chat.find({
            userId : user._id
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success : true ,
            message : "Chats fetched",
            chat
        })
        
        
    } catch (error) {
        console.log(error)
         return res.status(500).json({
                success: false , 
                message : "Unable to fetch chats"
            })
        
    }
    
}
export const renameChat = async(req,res)=>{
    try {
        const {chatId } = req.params ;
        const {rename}=req.body;
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(400).json({
                success: false,
                message : 'No chat found'
            })
        }
        chat.title = rename;
        await chat.save();
        return res.status(200).json({
            success:true,
            message:"Renamed successfully",
            renamedTitle:chat.title
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message : "Internal server error while renaming"
        })
        
    }
}

export const deleteChat = async(req,res)=>{
    try {
       const { chatId } = req.params;

        const chat = await Chat.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({
                success:false,
                message:"Chat not found"
            });
        }

        await ThumbnailChat.deleteOne({ chatId });

        return res.status(200).json({
            success:true,
            message : 'Chat deleted successfully'
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error while deleting chat"
        })
        
        
    }
}