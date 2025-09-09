import express from "express";
import {  requireAuth } from '@clerk/express'
import { createOrder, razorpayWebhook, verifyPayment } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order",requireAuth(),createOrder);
router.post("/verify-payment",requireAuth(),verifyPayment);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);




export default router;