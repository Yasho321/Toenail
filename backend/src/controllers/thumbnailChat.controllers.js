import ThumbnailChat from "../models/thumbnailChat.model.js";
// SDK initialization
import 'dotenv/config'
import ImageKit from 'imagekit';
import fs from 'fs'
import OpenAI from 'openai';
import { Memory } from 'mem0ai/oss';
import {   getAuth } from '@clerk/express'
import { GoogleGenAI, Modality } from "@google/genai";
import Chat from "../models/chat.model.js";
import sharp from "sharp";
import User from "../models/user.model.js";
const client = new OpenAI();
 const ai = new GoogleGenAI({});

 


const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLICKEY,
    privateKey : process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint : process.env.IMAGEKIT_URL
});

const mem = new Memory({
  version: 'v1.1',
  enableGraph: true,
  graphStore: {
    provider: 'neo4j',
    config: {
      url: process.env.NEO4J_URI,
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
      storeEmbeddings: false,
    },
  },
  vectorStore: {
    provider: 'qdrant',
    config: {
      collectionName: 'memories',
      embeddingModelDims: 1536,
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY, 
      https: true,
    },
  },
});

export const createChat = async (req , res)=>{
    try {
        
        const { userId } = getAuth(req)
        const {chatId} = req.params; 
        const token = req.user.tokenBalance;
        const {genre , title , mood ,resolution, prompt} = req.body;
        const memories = await mem.search(prompt, { userId: 'piyush' });
        const memStr = memories.results.map((e) => e.memory).join('\n');
        const CONTEXT = `
            Important Context About User according to the previous conversations:
             ${memStr}
        `
        const file = req.file;
        let width ; 
        let height; 
        console.log(resolution)
        console.log(resolution.includes('video'));
        
        if(resolution.includes('video')){
            width = 1280
            height = 720
        }else{
            width = 1080 
            height = 1920
        }
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
        let messages = chatMessages?.messages || [];
        let previousChats ;
        if (messages.length >50){
            previousChats  = messages.splice(-50);
        }
        previousChats = messages ;

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
            - Give prompts such that it makes professional level thumbnails.
            - Include prompts which makes it look more real , and less ai generated
            - given image should strictly be in given resolution
            - font in the thumbnail should look good
            - make it realistic 
            - do not make it cartooni 
            - choose right fonts 
            - use image given by user


            IMPORTANT : -
            -  given image should strictly be in given resolution


            Prompt :- 
            ${prompt}
            Resolution:-
            ${resolution} (Image produced should be strictly in this resolution)
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
            - Give prompts such that it makes professional level thumbnails.
            - Include prompts which makes it look more real , and less ai generated
            - given image should strictly be in given resolution
             - font in the thumbnail should look good
             - make it realistic 
            - do not make it cartooni 
            - choose right fonts 
             - use image given by user

             IMPORTANT : -
            -  given image should strictly be in given resolution

            Prompt :- 
            ${prompt}
            Resolution:-
            ${resolution} (Image produced should be strictly in this resolution)
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
            - Give prompts such that it makes professional level thumbnails.
            - Include prompts which makes it look more real , and less ai generated
            - given image should strictly be in given resolution
            - font in the thumbnail should look good
            - make it realistic 
            - do not make it cartooni 
            - choose right fonts 
             - use image given by user

            IMPORTANT : -
            -  given image should strictly be in given resolution

            Prompt :- 
            ${prompt}
            Resolution:-
            ${resolution} (Image produced should be strictly in this resolution)
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
            { text: `refined description :${refinedPrompt} , previous messages: ${previousChats}  ,user original query : ${prompt} ,
             Important context about user : ${CONTEXT}` },
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
                const imageBuffer = Buffer.from(imageData, "base64");
                const resizedBuffer = await sharp(imageBuffer)
                .resize(width, height, {
                    fit: "inside",
                    withoutEnlargement: true 
                })
                .toFormat("png") // Keep PNG format
                .toBuffer();

                const resizedBase64 = resizedBuffer.toString("base64");

                const uploadedImage= await imagekit.upload({
                    file: `data:image/png;base64,${resizedBase64}`,
                    fileName: `${chatTitle}-thumbnail1.png`,
                    folder: "/thumbnail-img",
                    
                });
               
                images2.push(uploadedImage.url)
                
            }
        }
        const promptForBanana2 = [
            { text: `refined description :${refinedPrompt2} , previous messages: ${previousChats}  ,user original query : ${prompt}
                Important context about user : ${CONTEXT}
            ` },
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
                const imageBuffer = Buffer.from(imageData, "base64");
                const resizedBuffer = await sharp(imageBuffer)
                .resize(width, height, {
                    fit: "inside",
                    withoutEnlargement: true 
                })
                .toFormat("png") // Keep PNG format
                .toBuffer();

                const resizedBase64 = resizedBuffer.toString("base64");

                const uploadedImage= await imagekit.upload({
                    file: `data:image/png;base64,${resizedBase64}`,
                    fileName: `${chatTitle}-thumbnail1.png`,
                    folder: "/thumbnail-img",
                    
                });
               
                images2.push(uploadedImage.url)
            }
        }
        const promptForBanana3 = [
            { text: `refined description :${refinedPrompt3} , previous messages: ${previousChats}  ,user original query : ${prompt} 
                Important context about user : ${CONTEXT}
            ` },
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
                const imageBuffer = Buffer.from(imageData, "base64");
                const resizedBuffer = await sharp(imageBuffer)
                .resize(width, height, {
                    fit: "inside",
                    withoutEnlargement: true 
                })
                .toFormat("png") // Keep PNG format
                .toBuffer();

                const resizedBase64 = resizedBuffer.toString("base64");

                const uploadedImage= await imagekit.upload({
                    file: `data:image/png;base64,${resizedBase64}`,
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
       

        // Save safe data to mem0
        await mem.add(
        [
            { role: "user", content: prompt },
            { role: "assistant", content: messageResponse.text },
        ],
        { userId : String(userId) }
        );
        

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
       const { userId } = getAuth(req)
        const {chatId} = req.params;
        if(!userId || ! chatId){
            return res.status(400).json({
                success : false , 
                message : "Unautharized or chat does not exist"
            })
        }
        const messages = await ThumbnailChat.find({
            userId : userId ,
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