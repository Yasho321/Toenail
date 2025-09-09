import {Router } from 'express';
import {  requireAuth } from '@clerk/express'
import { createChat, getChat } from '../controllers/chat.controllers.js';


const router = Router();

router.post("/",requireAuth(),  createChat)


router.get("/" , requireAuth(), getChat)



export default router;