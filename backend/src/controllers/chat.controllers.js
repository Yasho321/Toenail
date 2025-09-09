import Chat from "../models/chat.model.js";
import {   getAuth } from '@clerk/express'

export const createChat = async (req , res)=>{
    try {
         const { userId } = getAuth(req)
        if(!userId) {
            return res.status(400).json({
                success: false , 
                message : "Unauthorized"
            })
        }

        const chat = await Chat.create({
            userId : userId
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
         const { userId } = getAuth(req) 
        if(!userId) {
            return res.status(400).json({
                success: false , 
                message : "Unauthorized"
            })
        }

        const chat = await Chat.find({
            userId : userId
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