import {Router } from 'express';

import { createChat, getChat } from '../controllers/chat.controllers.js';



const router = Router();

router.post("/", createChat)


router.get("/" , getChat)



export default router;