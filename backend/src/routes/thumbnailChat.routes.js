import {Router } from 'express';

import { continueChat, createChat, getChat } from '../controllers/thumbnailChat.controllers.js';
import { uploadOne } from '../libs/multer.js';
 


const router = Router();

router.post("/:chatId", uploadOne,  createChat)
router.put("/:chatId", continueChat)

router.get("/:chatId" ,  getChat)



export default router;