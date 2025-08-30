import ThumbnailChat from "../models/thumbnailChat.model.js";
// SDK initialization
import 'dotenv/config'
import ImageKit from 'imagekit';
import fs from 'fs'
import OpenAI from 'openai';
import { GoogleGenAI, Modality } from "@google/genai";
import Chat from "../models/chat.model.js";
const client = new OpenAI();
 const ai = new GoogleGenAI({});

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLICKEY,
    privateKey : process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint : process.env.IMAGEKIT_URL
});

export const createChat = async (req , res)=>{
    try {
        const userId = req.user._id;
        const {chatId} = req.params; 
        const token = req.user.tokenBalance;
        const {genre , title , mood ,resolution, prompt} = req.body;
        const file = req.file;
        let images=[];
        let chatTitle ;
       if(token <= 0){
        return res.status(400).json({
            success : false , 
            message : "not enough tokens to continue"
        })
       }
           
        const imgpath = file.path;
        const imageData = fs.readFileSync(imgpath);
        const base64Image = imageData.toString("base64");
        const uploadedImage=await imagekit.upload({
            file: base64Image,
            fileName: file.originalname,
            folder: "/user-img",
        });
        
        images.push(uploadedImage.url);     
        let chatMessages= await ThumbnailChat.findOne({
            userId,
            chatId
        }) 
        if(!chatMessages){
            chatMessages= await ThumbnailChat.create({
                userId,
                chatId
            })

             const response = await client.chat.completions.create({
                model: 'gpt-4.1-mini',
                messages: [{
                    role : 'user',
                    content : `Give a title for this chat 
                        prompt :- 
                        ${prompt}

                        video title :- 
                        ${title}
                    `
                }],
            }); 
             chatTitle = response.choices[0].message.content ;
             const chat = await Chat.findByIdAndUpdate(
                chatId,{
                    title :  chatTitle
                },
                 {
                    new: true,         
                }
             )


        }
        let messages = chatMessages.messages;
        messages.push({
            role: 'user',
            text:prompt,
            images:images
        })

        




    

        const SYSTEM_PROMPT = `
            You are an expert query rewritting assistant . You work is to refine the prompt along with other data given to make a prompt such 
            that it makes the best thumbnail for youtube . 
            You have to make the prompt such that it describe the thumbnail in more elaborate way so that accuracy of thumbnail should be max 
            and as per the user's request . 
            Rules :- 
            - Never alter user's request , and add anything on your own . 

            Prompt :- 
            ${prompt}
            Resolution:-
            ${resolution}
            Mood of the video:-
            ${mood}
            Genre of the video :-
            ${genre}
            Title of the video:-
            ${title}
        `

        const response = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : SYSTEM_PROMPT
            }],
        }); 

         const refinedPrompt = response.choices[0].message.content ;
         const SYSTEM_PROMPT2 = `
            You are an expert query rewritting assistant . You work is to refine the prompt along with other data given to make a prompt such 
            that it makes the best thumbnail for youtube . 
            You have to make the prompt such that it describe the thumbnail in more elaborate way so that accuracy of thumbnail should be max 
            and as per the user's request . 
            Rules :- 
            - Never alter user's request , and add anything on your own . 

            Prompt :- 
            ${prompt}
            Resolution:-
            ${resolution}
            Mood of the video:-
            ${mood}
            Genre of the video :-
            ${genre}
            Title of the video:-
            ${title}

            And the prompt should be different from this :-
            ${refinedPrompt}
        `
         const response2 = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : SYSTEM_PROMPT2
            }],
        }); 
         const refinedPrompt2=response2.choices[0].message.content ;

         const SYSTEM_PROMPT3 = `
            You are an expert query rewritting assistant . You work is to refine the prompt along with other data given to make a prompt such 
            that it makes the best thumbnail for youtube . 
            You have to make the prompt such that it describe the thumbnail in more elaborate way so that accuracy of thumbnail should be max 
            and as per the user's request . 
            Rules :- 
            - Never alter user's request , and add anything on your own . 

            Prompt :- 
            ${prompt}
            Resolution:-
            ${resolution}
            Mood of the video:-
            ${mood}
            Genre of the video :-
            ${genre}
            Title of the video:-
            ${title}

            And the prompt should be different from this :-
            - ${refinedPrompt}
            - ${refinedPrompt2}
        `
         const response3 = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'user',
                content : SYSTEM_PROMPT3
            }],
        }); 

        const refinedPrompt3=response3.choices[0].message.content ;
         const promptForBanana = [
            { text: refinedPrompt },
            {
            inlineData: {
                mimeType: "image/png",
                data: base64Image,
            },
            },
        ];
        let messageResponse={
            role:"assistant"
        };
        let images2=[]
        const response4 = await ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents: promptForBanana,
        });
        for (const part of response4.candidates[0].content.parts) {
            if (part.text) {
                messageResponse.text = part.text;         
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const uploadedImage= await imagekit.upload({
                    file: `data:image/png;base64,${imageData}`,
                    fileName: `${chatTitle}-thumbnail1.png`,
                    folder: "/thumbnail-img",
                });
                images2.push(uploadedImage.url)
                
            }
        }
        const promptForBanana2 = [
            { text: refinedPrompt2 },
            {
            inlineData: {
                mimeType: "image/png",
                data: base64Image,
            },
            },
        ];
        
        const response5 = await ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents: promptForBanana2,
        });
        for (const part of response5.candidates[0].content.parts) {
           if (part.inlineData) {
                const imageData = part.inlineData.data;
                const uploadedImage= await imagekit.upload({
                    file: `data:image/png;base64,${imageData}`,
                    fileName: `${chatTitle}-thumbnail1.png`,
                    folder: "/thumbnail-img",
                });
                images2.push(uploadedImage.url)
            }
        }
        const promptForBanana3 = [
            { text: refinedPrompt3 },
            {
            inlineData: {
                mimeType: "image/png",
                data: base64Image,
            },
            },
        ];
       
        const response6 = await ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents: promptForBanana3,
        });
        for (const part of response6.candidates[0].content.parts) {
           if (part.inlineData) {
                const imageData = part.inlineData.data;
                const uploadedImage= await imagekit.upload({
                    file: `data:image/png;base64,${imageData}`,
                    fileName: `${chatTitle}-thumbnail1.png`,
                    folder: "/thumbnail-img",
                });
                images2.push(uploadedImage.url)
            }
        }
        messageResponse.images=images2;
        messages.push(messageResponse);
        chatMessages.messages=messages;
        fs.unlinkSync(imgpath);

        await chatMessages.save();
        await User.findByIdAndUpdate(
            userId,
            { $inc: { tokenBalance: -1 } },  
            { new: true }              
        );


        return res.status(200).json({
            success : true , 
            message : "Thumbnail created successfully",
            chatMessages, 
            response : messageResponse
        })



        
    } catch (error) {
         console.log(error)
         return res.status(500).json({
                success: false , 
                message : "Unable to create thumbnails"
            })
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