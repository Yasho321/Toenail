import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import downloadRoutes from './routes/download.routes.js'
import thumbnailRoutes from './routes/thumbnailChat.routes.js'
import { clerkMiddleware,  } from '@clerk/express'
import mongoose from "mongoose";




dotenv.config()



const app = express();

const port= process.env.PORT || 8080;


app.use(cors({
    origin: 'https://www.toenail.in',
    credentials: true,               
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
       allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
}));


app.use(clerkMiddleware());

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/chat",chatRoutes)
app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/thumbnail",thumbnailRoutes)
app.use("/api/v1/download",downloadRoutes)




const db = () =>{
    
    
    
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to MongoDB");
        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`)
        })

    }).catch((error)=>{
        console.log("Error connecting to MongoDB",error);
    })
}
db();



app.get("/api/v1/healthcheck",(req,res)=>{
    

    res.send("Server is running")
})