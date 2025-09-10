import {Router } from 'express';

import { createChat, getChat } from '../controllers/chat.controllers.js';
import { clerkMiddleware } from '@clerk/express';


const router = Router();

router.post("/",clerkMiddleware(), createChat)


router.get("/" ,clerkMiddleware(), getChat)



export default router;