import ThumbnailChat from "../models/thumbnailChat.model.js";

export const createChat = async (req , res)=>{
    try {
        

        
    } catch (error) {
        
    }

}
export const getChat = async (req , res)=>{
    try {
        const user = req.user._id;
        const {chatId} = req.params;
        if(!user || ! chatId){
            return res.status(400).json({
                success : false , 
                message : "Unautharized or chat does not exist"
            })
        }
        const messages = await ThumbnailChat.find({
            userId : user ,
            chatId
        })
        if (!messages){
            return res.status(400).json({
                success : false , 
                message : "Unable to fetch messages"
            })
        }
        return res.status(200).json({
            success:true , 
            message : "Messages Fetched",
            chatMessages : messages
        })
        
    } catch (error) {
         console.log(error)
         return res.status(500).json({
                success: false , 
                message : "Unable to fetch messages of chats"
            })
    }
    
}