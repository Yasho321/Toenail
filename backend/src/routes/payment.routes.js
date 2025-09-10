import express from "express";

import { createOrder, razorpayWebhook, verifyPayment } from "../controllers/payment.controllers.js";
import { clerkMiddleware } from "@clerk/express";

const router = express.Router();

router.post("/create-order",clerkMiddleware(),createOrder);
router.post("/verify-payment",clerkMiddleware(),verifyPayment);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);




export default router;