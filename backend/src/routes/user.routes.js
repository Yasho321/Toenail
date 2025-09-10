import {Router } from 'express';
import express from 'express'
 
import {getMe, webhookHandler } from '../controllers/user.controllers.js';

const router = Router();



router.get("/me" ,  getMe)
router.post(
  "/clerk",
  express.raw({ type: 'application/json' }),
  webhookHandler,
)



export default router;