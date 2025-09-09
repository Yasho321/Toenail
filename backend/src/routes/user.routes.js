import {Router } from 'express';
import express from 'express'
import {  requireAuth } from '@clerk/express'
import {webhookHandler } from '../controllers/user.controllers.js';

const router = Router();



router.get("/me" , requireAuth(), getMe)
router.post("/clerk", express.raw({ type: 'application/json' }),webhookHandler)



export default router;