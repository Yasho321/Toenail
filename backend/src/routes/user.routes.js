import {Router } from 'express';
import express from 'express'
import {  clerkMiddleware, requireAuth } from '@clerk/express'
import {getMe, webhookHandler } from '../controllers/user.controllers.js';

const router = Router();



router.get("/me" ,clerkMiddleware(),  getMe)
router.post(
  "/clerk",
  express.raw({ type: 'application/json' }),
  webhookHandler,
)



export default router;