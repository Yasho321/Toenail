import express from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { createOrder, verifyPayment } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order",isLoggedIn,createOrder);
router.post("/verify-payment",isLoggedIn,verifyPayment);



export default router;