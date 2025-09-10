import {Router } from 'express';

import { createChat, getChat } from '../controllers/thumbnailChat.controllers.js';
import { uploadOne } from '../libs/multer.js';
import { clerkMiddleware } from '@clerk/express';


const router = Router();

router.post("/:chatId",clerkMiddleware(),uploadOne,  createChat)


router.get("/:chatId" , clerkMiddleware(), getChat)



export default router;