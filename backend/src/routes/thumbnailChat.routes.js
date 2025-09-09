import {Router } from 'express';
import {  requireAuth } from '@clerk/express'
import { createChat, getChat } from '../controllers/thumbnailChat.controllers.js';
import { uploadOne } from '../libs/multer.js';


const router = Router();

router.post("/:chatId",requireAuth(),uploadOne,  createChat)


router.get("/:chatId" , requireAuth(), getChat)



export default router;