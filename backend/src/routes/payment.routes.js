import express from "express";

import { createOrder, downloadReciept, getAllPayment, razorpayWebhook, verifyPayment } from "../controllers/payment.controllers.js";
 

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.post(
  "/webhook",
  
  razorpayWebhook
);
router.get("/", getAllPayment);
router.get("/:id", downloadReciept);




export default router;