import ThumbnailChat from "../models/thumbnailChat.model.js";
// SDK initialization
import 'dotenv/config'
import ImageKit from 'imagekit';
import fs from 'fs'
import OpenAI from 'openai';
import axios from 'axios'
import { Memory } from 'mem0ai/oss';
import {   getAuth } from '@clerk/express'
import { GoogleGenAI, Modality } from "@google/genai";
import Chat from "../models/chat.model.js";
import sharp from "sharp";
import User from "../models/user.model.js";
import 'dotenv/config'
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


async function resizeBase64(base64Image, width, height) {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imgBuffer = Buffer.from(base64Data, "base64");

  const resizedBuffer = await sharp(imgBuffer)
    .resize(width, height, {
      fit: "contain",      
      background: { r: 0, g: 0, b: 0, alpha: 0 } 
    })
    .toBuffer();

  return `${resizedBuffer.toString("base64")}`;
}
export const createChat = async (req , res)=>{
    try {
        
        let { userId } = getAuth(req, { acceptsToken: 'any' })
        const user = await User.findOne({clerkId : userId});
        if(user.tokenBalance<=0){
            return res.status(400).json({
                success : false , 
                message : "Not enough tokens to continue"
            })
        }
        userId = user._id

        

        const {chatId} = req.params; 
       
        const token = user.tokenBalance;
        const {genre , title , mood ,resolution, prompt} = req.body;
        const file = req.file;
        const imgpath = file.path;
        const imageData = fs.readFileSync(imgpath);
        const base64Image = imageData.toString("base64");
        const uploadedImage=await imagekit.upload({
            file: base64Image,
            fileName: file.originalname,
            folder: "/user-img",
        });
        const imagekitFileId= uploadedImage.fileId
        const moderation = await client.moderations.create({
            model: "omni-moderation-latest",
            input: [
                { type: "text", text: prompt },
                {
                    type: "image_url",
                    image_url: {
                        url: uploadedImage.url
                        
                    }
                }
            ],
        });
        const moderationRes = moderation.results[0];
        const flag = moderationRes.flagged ; 
        if(flag){
            const response = await imagekit.deleteFile(imagekitFileId);
            return res.status(400).json({
                success:false , 
                messages : "Improper Content Can't process"
            })
        }
        
        const memories = await mem.search(prompt, { userId: String(userId) });
        const memStr = memories.results.map((e) => e.memory).join('\n');
        const CONTEXT = `
            Important Context About User according to the previous conversations:
             ${memStr}
        `
        
        let width ; 
        let height; 
        
        
        if(resolution.includes('1280 x 720')){
            width = 1280
            height = 720
        }else if('1920 x 1080'){
            width=1920
            height=1080
        }else{
            width = 1080 
            height = 1920

        }

        const resizedInput = await resizeBase64(base64Image,width,height)
        let images=[];
        let chatTitle ;
       if(token <= 0){
        return res.status(400).json({
            success : false , 
            message : "not enough tokens to continue"
        })
       }
           
        
        
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

                        IMPORTANT :- 
                        Output should be single string with only title no filler prefix
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
            - do not make it cartoonish 
            - choose right fonts 
            - use image given by user

            Here are some few shot examples of some good prompts :-

            gaming prompt :- 
            Create a high-impact YouTube gaming thumbnail featuring the provided creator’s face photo in the foreground.
            Make the face large but not extra large, expressive, and dramatic (shocked, scared, hyped, or excited) with a gaming setup (eg:- headphones must ).
            Place the creator off-center.
            Add game-specific background scenes (e.g., monsters for horror, battlegrounds for shooters, mystical landscapes for fantasy).
            Include key game elements or characters near the creator for context (zombies, NPCs, enemies, weapons, symbols).
            Use cinematic lighting and effects (fog, sparks, fire, glowing eyes, motion blur) to enhance tension and excitement.
            Add the game title or short text in bold, eye-catching fonts that match the game’s aesthetic (horror = distressed font, action = metallic, fantasy = glowing runes, etc.).
            Style: hyper-realistic, cinematic, oversaturated colors, optimized for YouTube CTR.

            music prompt :- 
            A cinematic, eye-catching thumbnail for a music video featuring the main artist or central figure in focus. Background can adapt to the mood — warm golden tones for romance, dark dramatic spotlight for intense themes, bright colorful lights for festive/energetic vibes ,etc. The scene should feel like a film poster: expressive poses, cinematic lighting, and professional composition. Add large bold stylish title text (the song name) at the top or center, glowing or metallic and make it a bit calligraphatic for strong visibility. Include optional supporting text like ‘Official Video’ or view counts. Overall look should be high-quality and trending on YouTube, instantly grabbing attention."

            vlogs and lifestyle :- 
            A natural, aesthetic vlog thumbnail featuring the video creator in focus. Background shows an everyday lifestyle scene — such as a cozy home interior, a city street, or an outdoor setting according to the information of the user it should seem he is vlogging in thumbnail where he said in the prompt. Lighting should be soft and cinematic but realistic (warm indoor lights or natural daylight). The style should be minimal and relatable, like a lifestyle photo. Add large, clean white serif text overlay with the video title (e.g., 'a cozy day', 'NYC vlog', 'a day in my life'). The overall feel should be simple, authentic, and eye-catching, similar to trending YouTube vlog thumbnails.

            Tech and Review :- 
            Create a vibrant, eye-catching YouTube thumbnail for a tech/review video. Place the video creator prominently in the foreground using the provided image, with a strong facial expression (surprised, excited, intrigued, or shocked). Use a background that suits the setting. Include large, sharp, realistic images of the product, gadget, or software being reviewed, positioned clearly and angled toward the viewer. Add bold, minimal text if necessary (e.g., short phrases like 'This is Crazy!' or 'New Tech!'). Ensure the design is modern, high-definition, with saturated colors, strong lighting, and clear separation between the creator, background, and objects.

            Education & How-To :-
            Create a bold and eye-catching YouTube thumbnail for an educational or how-to video. Place a large, clear, close-up photo of the video creator on one side with good lighting and a confident or friendly expression. On the other side, add bright, relevant icons(important)(for ex:- use openAI's logo if talking about AI ), diagrams (should be related to the topic for ex don't add a human diagram on a tech video for the sake of it), or illustrations related to the video topic (e.g., app logos, formulas, science symbols, finance icons all accordingly don't confuse between tech and science). Use big, bold, easy-to-read text in uppercase with high contrast (like yellow, white, or blue) showing the main topic keywords (e.g., 'HOW IT WORKS', 'BUILD CHAT APP', 'LAWS OF MOTION'). Add highlights, glow, or banners to make the text pop. Use a clean, modern background with gradients or abstract patterns, ensuring the overall look is professional, vibrant, and clickable, optimized for YouTube education content.

            Comedy & Entertainment:-
            Create a bold and eye-catching YouTube thumbnail for a comedy or entertainment video. Place a large, expressive photo of the video creator (or group of creators) in the foreground, showing funny, exaggerated, or playful facial expressions. Add thematic props, costumes, or graphic effects (like hats, halos, devil horns, funny signs, or posters) to enhance the humor. Use large, bold, easy-to-read text in uppercase with bright, high-contrast colors (yellow, red, white, etc.), often with quotation marks or playful phrases that match the comedic theme. Keep the background simple but thematic (e.g., stage curtain, dark comedy set, dramatic backdrop) so the faces and text pop. Ensure the overall look is fun, vibrant, and clickable, optimized for YouTube comedy & entertainment content.

            Fitness & Health:-
            YouTube thumbnail style, photorealistic, high detail, dynamic fitness photo of a [male/female] fitness creator, [describe their action, e.g., flexing confidently, holding healthy food, performing a stretch]. They are looking at the camera with a motivated expression.
            The image is dominated by large, bold, impactful text that reads: "[MAIN HEADLINE]". Below it, smaller but still bold text shows a contrast: "[NEGATIVE/WRONG WAY]" vs "[POSITIVE/RIGHT WAY]". The text has a strong outline or shadow for maximum readability.
            The background is a clean, modern, blurred gym or kitchen background with vibrant color gradients. The overall style is professional, high-energy, and optimized for YouTube thumbnails with high contrast and saturation.

            Beauty and Fashion :- 
            YouTube thumbnail style, photorealistic, soft lighting, a beautiful [male/female] creator, [describe their pose and expression, e.g., smiling confidently at the camera, looking over their shoulder]. They are stylishly dressed in [describe outfit aesthetic, e.g., a formal blazer, a casual chic outfit].
            The image features large, elegant text that reads: "[MAIN HEADLINE: e.g., MY GLOWUP ROUTINE]". Additional text like "[AFFORDABLE LUXURY]" or "[DAYS] TO [GOAL]" is placed stylishly around the composition. The text uses a modern, stylish font with a slight glow or shadow for readability.
            The background is a soft-focus, aesthetic environment like a modern bedroom, a plain pastel wall, or an elegant coffee shop. The color palette is cohesive and pleasing, with a slight warm filter. The overall style is aspirational, clean, and optimized for YouTube with high clarity.

            Food & Cooking:-
            YouTube thumbnail style, photorealistic, extreme close-up shot of a delicious [dish name], steaming hot and freshly cooked. The food looks juicy, textured, and glistening, garnished with fresh cilantro/coriander leaves. A person's hands are in the frame, [describe interaction, e.g., holding the bowl, pouring gravy, breaking a piece of bread].
            Large, bold, white or yellow text with a black outline is overlaid on the image, clearly readable, that says: "[DISH NAME IN CAPS]". Smaller text above or below adds context like "[REGION]'s Famous" or "[DESCRIPTOR, e.g., RESTAURANT STYLE, HOMEMADE]".
            The background is a soft-focus, blurred kitchen environment. The style is highly saturated, high contrast, and cinematic food photography, designed to make the food look incredibly appetizing. Shot on a DSLR with a macro lens.

            Travel & Adventure:-
            YouTube thumbnail style, cinematic wide-angle photograph of a [male/female] travel creator from behind, looking out over a stunning view of [famous landmark or landscape, e.g., mountain range, city skyline, beach]. The scene is captured during golden hour with warm, dramatic lighting.
            Large, bold, white text with a black outline is overlaid on the sky or a dark part of the image. The text reads: "[INTRODUCTORY PHRASE: e.g., SECRETS OF, I CAN'T BELIEVE, EXPLORING]" followed by "[LOCATION NAME IN CAPS]". The style is epic, aspirational, and makes the viewer want to click to experience the journey.
                    
                        
        `

        const USER_PROMPT =`
            User Prompt :- 
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
                role : 'system',
                content : SYSTEM_PROMPT
            },{
                role: 'user',
                content: USER_PROMPT
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

             Here are some few shot examples of some good prompts :-

            gaming prompt :- 
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo (image provided ) in the 
            foreground (either on left or right) , make that face large but not too much large , with very expressive emotions according to the feel 
            of the game ( such as shocked , scared , excited , hyped , sad , happy ) make it dramatic , creator should be in a gaming setup headphones 
            are mandatory make the creator wear headphones . Place the creator's photo on either left or right . The background should be from the game , 
            scenes from the game , characters from the game . (such as ghosts for horror , battlegrounds for shooters , mystical landscapes for fantasies ) 
            try to use the scenes from the game only . Include important game elements , characters in the thumbnail to set better context (such as NPC'S , 
            characters , zombies , enemies , Main character , weapons , symbols). Make the thumbnail cinematic with lightening , effects and color grading 
            to enhance tension , excitement and interest . Add the title of the game or any relevant short text in the font and font style same as the game 
            , it should be bold eye catching same as the game aesthetics (it should be wither from the game or it should be according to the game such as 
            distressed font for horror , metallic for action , glowing runes for fantasy , etc . ) , The style of the thumbnail should be cinematic , 
            saturated colors . It should be hyper realistic and should be optimized to increase YouTube click through rate .

            music prompt :- 
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo (image provided ) in the
            foreground. Creator should be the main focus .It should be eye catching and soothing . Background should adapt according to the mood  it
            should have some real life background of outdoor and indoor according to the mood of the song , having tones according to the feel fresh 
            tones for love songs and romantic songs , dramatic and cinematic tone for intense themes , color full and festive tone for festive energetic
            vibes , dull tones for sad songs . The scene should feel like a movie poster , Having professional composition , expressive poses , 
            lighting according to the mood and main focus on artist . If it's a cover song mandatorily give creator a mic thumbnail . Text should be 
            stylish and bold should look pretty and should go with the feel of the song ( name of the song - compulsory ) , If mentioned it should have 
            text like 'official video' or view counts milestones . It should look high-quality , aesthetic , elegant to eyes , It should instantly grab 
            attention and should make the video or song trending in YouTube . 
            
            vlogs and lifestyle :- 
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo (image provided ) in 
            the foreground. Creator should be the main focus . with a natural background such as home interior , streets , gym , car , either an 
            indoor or outdoor setting . Background should be according to the video . Lighting should be realistic according to the background 
            setting . It should have minimal and relatable style , like a photo from day to day life (candid) .Text should be serif with white 
            color showing the title ( such as :- "Gym day", "NYC vlog" , "A day in life of a pilot") . Feel of the thumbnail should be authentic , 
            real and realistic . It should be a thumbnail that grabs attention to increase the views of the video in Youtube

            Tech and Review :- 
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo 
            (image provided )(should be either left or right of the thumbnail) and product in the foreground. Main focus should be on product with creator having a very dramatic expressions such 
            as shocked , excited , intrigued and surprise , etc . Use a Solid bright color or a Solid bright color with a bit of subtle white 
            gradient glow from the product as a background that contrasts with the subject and looks good . The product image should be large 
            , realistic image , clear such as gadget ,  product or a software in front of the creator . Text should be bold and minimal should be 
            used only when needed such as 'This is crazy' and 'This tech will replace humans' , etc.. . The design should have saturated colors , 
            strong lighting focusing on product and should have clear separation between creator , background and the product .

            Education & How-To :-
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo 
            (image provided ) in the foreground. Place a large clear close up photo of the creator either on the left or on the right of the 
            image having good lighting with a confident friendly and a smiling expression . Background should be a solid bright color having a 
            good contrast with the topic of the video . Add stuff related to the topic of the video such as relevant icons , diagram or 
            illustrations related to the video topic (such as app logos , formulas , symbols , images etc ..) Text should be big , bold , clear , 
            easy to read , in uppercase having a contrast , text should depict the main topic of the video ( Such as "BUILD YOUR OWN SAAS APP" , 
            "WHAT IS KAFKA", "PHYSICS - GRAVITATION" , etc .. ) Add a subtle white glow coming from the icons , diagrams , illustrations related to 
            the topic . Make the text pop by highlighting , glow , banners , and all the other things required . Background should have solid 
            colors having white gradient around the topic and icons . Make the thumbnail such that student gets interested to click on the video and 
            You tube recommendations improve for the video 

            
            Comedy & Entertainment:-
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo 
            (image provided ) in the foreground. Place a large and expressive photo of the creator either on the left or on the right of the 
            image showing funny , exaggerated or playful facial expressions , Add thematic props to the creator or in the background such as hats 
            , halos , devil horns , funny signs , funny or humorous costumes to the creator and posters , etc ... to increase the humor . Text should 
            be large and bold with high contrast color , it should be easy to read with playful phrases , uppercase with a comedic theme . 
            Background should be simple but thematic sometimes should have some humor elements in the background . such as stage curtains , dark 
            comedy set with good lighting on the creator , dramatic backdrop , etc ... Creator should be main focus . Make the thumbnail fun , 
            vibrant and optimized for you tube so that it gets views . 
            
            Fitness & Health:-
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo 
            (image provided ) in the foreground. Make the thumbnail photorealistic with high details , with a dynamic fitness photo of the 
            creator according to the user , With action described such as flexing confidently , holding healthy food , performing a stretch . 
            Creator looking at the camera confidently , Text should be bold such as "top 5 exercises for xyz " , "best diet" , etc .. Background 
            should be of setting which promotes fitness such as gym , kitchen for diets , calisthenics park , etc .. Overall style is professional 
            , high energy , motivating and optimized for you tube thumbnails to increase the views of the video with high contrast and saturation .
            
            Beauty and Fashion :- 
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo 
            (image provided ) in the foreground. Thumbnail should be photorealistic with soft lighting . Pose and expressions described such as 
            smiling confidently at the camera , looking over their shoulder, sitting confidently , etc .. The should be dressed good in outfit 
            described such as formal . blazer , a casual chic outfit , etc .. Text should be large and elegant , The text uses a modern , stylish 
            font with a slight glow . The background has a aesthetic setting such as modern bedroom , a plain pastel wall or an elegant coffee shop 
            , background should be a bit blurred , The color palate should be pleasing and comforting to eyes , with a slight warm filter . The 
            overall style should be clean and optimized you tube virality with high quality 
                    
            Food & Cooking:-
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo 
            (image provided ) in the foreground. Thumbnail should be photo realistic with a close up shot of delicious dish mentioned , steaming hot 
            and freshly cooked . The food should look very tasty , juicy ,textured and glistening , garnished properly . It should seem the 
            creator cooked the meal . The background setting should be of a very beautiful kitchen . Large and bold contrasting text with dish name 
            in caps , small texts to convey something if needed in 5 words or less . The background should be a soft focus bit blurred but 
            beautiful kitchen , Thumbnail should be saturated with high contrast and cinematic food photography , making the food look very 
            appetizing , A very good quality image to increase the clicks on video in you tube 
          
            Travel & Adventure:-
            Create a YouTube thumbnail such that the click through rate of the thumbnail is very high . It should feature the creator's photo 
            (image provided ) in the foreground. Creator should be either on the left or right , Thumbnail should have wide angle cinematic shot of
            the place with the creator in it , It should have stunning landmark or landscape of the place such as mountain ranges , Eiffel tower 
            , pyramids , etc .. The scene is captured with very beautiful natural aesthetics such as in golden hour with warm , surreal 
            beautiful lighting , Text should be large , bold with high contrast with font that look good with the thumbnail settings and should 
            be comforting to the eyes , with phrases such as "exploring " , "secrets of" , "My dream came true" , etc .. followed my location name , 
            The style of the thumbnail should be epic , aspirational , reflecting on life , cinematic , philosophical and makes the viewer want to 
            click to experience the journey
        `

        const USER_PROMPT2 =`
            User Prompt :- 
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
         const response2 = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [{
                role : 'system',
                content : SYSTEM_PROMPT2
            },{
                role:'user',
                content:USER_PROMPT2
            }],
        }); 
         const refinedPrompt2=response2.choices[0].message.content ;

        
         const promptForBanana = [
            { text: `
                Thumbnail description :${refinedPrompt} , 
                previous messages: ${previousChats}  ,
                user original query : ${prompt} ,
                Important context about user : ${CONTEXT}` },
            {
            inlineData: {
                mimeType: "image/png",
                data: resizedInput,
            },
            },
        ];
        let messageResponse={
            role:"assistant",
            text:"Thumbnails",
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
            { text: `
                refined description :${refinedPrompt2} , 
                previous messages: ${previousChats}  ,
                user original query : ${prompt} ,
                Important context about user : ${CONTEXT}
            ` },
            {
            inlineData: {
                mimeType: "image/png",
                data: resizedInput,
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

export const continueChat = async(req,res)=>{
    try {
        const { userId } = getAuth(req, {acceptsToken :'any'})
        const user= await User.findOne({clerkId : userId})
        if(user.tokenBalance<=0){
            return res.status(400).json({
                success : false , 
                message : "Not enough tokens to continue"
            })
        }
        const {chatId} =req.params 
        const {url , prompt} = req.body ; 
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const base64 = Buffer.from(response.data, "binary").toString("base64");
         const memories = await mem.search(prompt, { userId: String(user._id) });
        const memStr = memories.results.map((e) => e.memory).join('\n');
        const CONTEXT = `
            Important Context About User according to the previous conversations:
             ${memStr}
        `

        const chat = await ThumbnailChat.findOne({chatId});
        if(!chat){
            return res.status(400).json({
                success:false , 
                message : "No such chat exists"
            })
        }
        let chatMessages = chat.messages ; 
        chatMessages.push({
            role: 'user',
            text: prompt,
            images : [url]
        })

        const chat2 = await Chat.findById(chatId)
        const chatTitle = chat2.title
        const promptForBanana = [
            { text: `
                Prompt :- ${prompt}
                Context about user :- ${CONTEXT}
                ` },
            {
            inlineData: {
                mimeType: "image/png",
                data: base64,
            },
            },
        ];
        const date = Date.now()

        let messageResponse = {role : "assistant"} ; 
        let images = [];

        const response2 = await ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents: promptForBanana,
        });
        for (const part of response2.candidates[0].content.parts) {
            if (part.text) {
                messageResponse.text = part.text;         
            } else if (part.inlineData) {
                
                const imageData = part.inlineData.data;
                const uploadedImage= await imagekit.upload({
                    file: `data:image/png;base64,${imageData}`,
                    fileName: `${chatTitle}-thumbnail${date}.png`,
                    folder: "/thumbnail-img",
                    
                });
               
                images.push(uploadedImage.url)
                
            }
        }
       messageResponse.images = images;
        chatMessages.push(messageResponse) ; 
        chat.messages = chatMessages ; 
        await chat.save(); 
        user.tokenBalance -= 1 ; 
        await user.save(); 

         await mem.add(
        [
            { role: "user", content: prompt },
            { role: "assistant", content: messageResponse.text },
        ],
        { userId : String(user._id) }
        );

        return res.status(200).json({
            success : true , 
            message : "Thumbnail chat continued successfully",
            chat, 
            updatedTokens : user.tokenBalance ,
            response : messageResponse
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false , 
            message : "Internal server while continuing Chat"
        })
        
        
    }
        
}

export const getChat = async (req , res)=>{
    try {
       const { userId } = getAuth(req, { acceptsToken: 'any' })
       const user = await User.findOne({clerkId : userId});
        const {chatId} = req.params;
        if(!userId || ! chatId || !user){
            return res.status(400).json({
                success : false , 
                message : "Unautharized or chat does not exist"
            })
        }
        const messages = await ThumbnailChat.find({
            userId : user._id ,
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