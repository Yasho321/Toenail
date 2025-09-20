import {Router } from 'express';

import { createChat, deleteChat, getChat, renameChat } from '../controllers/chat.controllers.js';



const router = Router();

router.post("/", createChat)
router.put("/:chatId",renameChat)
router.delete("/:chatId",deleteChat)


router.get("/" , getChat)



export default router;