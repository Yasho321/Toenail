import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { createChat, getChat } from '../controllers/thumbnailChat.controllers.js';
import { uploadOne } from '../libs/multer.js';


const router = Router();

router.post("/:chatId",isLoggedIn,uploadOne,  createChat)


router.get("/:chatId" , isLoggedIn, getChat)



export default router;