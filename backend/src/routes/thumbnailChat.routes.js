import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { createChat, getChat } from '../controllers/thumbnailChat.controllers.js';


const router = Router();

router.post("/:chatId",isLoggedIn,  createChat)


router.get("/:chatId" , isLoggedIn, getChat)



export default router;