import {Router } from 'express';

import { createChat, deleteChat, getChat, pin, renameChat } from '../controllers/chat.controllers.js';



const router = Router();

router.post("/", createChat)
router.put("/:chatId",renameChat)
router.delete("/:chatId",deleteChat)


router.get("/" , getChat)
router.get("/pin/:chatId" , pin)
router.get("/unpin/:chatId" , pin)




export default router;