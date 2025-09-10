import {Router } from 'express';

import { createChat, getChat } from '../controllers/thumbnailChat.controllers.js';
import { uploadOne } from '../libs/multer.js';


const router = Router();

router.post("/:chatId",uploadOne,  createChat)


router.get("/:chatId" ,  getChat)



export default router;