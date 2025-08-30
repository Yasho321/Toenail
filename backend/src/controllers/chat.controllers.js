import Chat from "../models/chat.model.js";

export const createChat = async (req , res)=>{
    try {
        const user = req.user._id; 
        if(!user) {
            return res.status(400).json({
                success: false , 
                message : "Unauthorized"
            })
        }

        const chat = await Chat.create({
            userId : user 
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
        const user = req.user._id; 
        if(!user) {
            return res.status(400).json({
                success: false , 
                message : "Unauthorized"
            })
        }

        const chat = await Chat.find({
            userId : user 
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