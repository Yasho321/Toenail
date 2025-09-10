import {Router } from 'express';
import express from 'express'
import {  requireAuth } from '@clerk/express'
import {getMe, webhookHandler } from '../controllers/user.controllers.js';

const router = Router();



router.get("/me" , requireAuth(), getMe)
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    // Store raw body for webhook verification
    req.rawBody = req.body
    next()
  },
  webhookHandler,
)



export default router;