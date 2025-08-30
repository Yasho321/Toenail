import express from "express";
import { authMiddleware } from "../middleware/auth.middlewares.js";
import { createOrder, verifyPayment } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order",authMiddleware,createOrder);
router.post("/verify-payment",authMiddleware,verifyPayment);



export default router;