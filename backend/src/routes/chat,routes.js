import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { createChat, getChat } from '../controllers/chat.controllers.js';


const router = Router();

router.post("/",isLoggedIn,  createChat)


router.get("/" , isLoggedIn, getChat)



export default router;