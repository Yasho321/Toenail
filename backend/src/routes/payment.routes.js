import express from "express";

import { createOrder, razorpayWebhook, verifyPayment } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order",createOrder);
router.post("/verify-payment",verifyPayment);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);




export default router;