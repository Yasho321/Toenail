import { razorpayInstance } from "../libs/razorpay.js";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import {   getAuth } from '@clerk/express'
export const createOrder = async (req, res) => {
  try {
    const { planName } = req.body;
     const { userId } = getAuth(req, { acceptsToken: 'any' })
     const user = await User.findOne({clerkId : userId});
    const plans = {
        standard: { amount: 250, tokens: 10 },
        premium: { amount: 600, tokens: 25 },
        pro: { amount: 1100, tokens: 50 },
    };
     
    const selected = plans[planName];
    
    if (!selected) return res.status(400).json({ message: "Invalid plan" });

    const options = {
        amount: selected.amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user._id, 
          tokens: selected.tokens.toString(),
        },
    };

    const order = await razorpayInstance.orders.create(options);

    

    res.status(200).json({ success : true , orderId: order.id, amount: selected.amount, tokens: selected.tokens });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false , message: "Internal Server Error while creating order" });
    
  }
};

// controllers/payment.js
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id,razorpay_signature} = req.body;
    

    

    const verifyingToken = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(verifyingToken.toString()).digest("hex");

    console.log({ expectedSignature, razorpay_signature })

    if(razorpay_signature !== expectedSignature){
        return res.status(400).json({
            success: false,
            message : "Signature did not match"
        })      
    }

     const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
    if (paymentDetails.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment not captured yet" });
    }

        

         res.status(200).json({ success: true ,
            message : "Payment verified successfully" 
         });

    

    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error while verifying payment" });
    
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];
     const body = req.body.toString("utf8");

    const shasum = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (shasum !== signature) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;

      
      const existingPayment = await Payment.findOne({ razorpayId: payment.id });
      if (existingPayment) {
        return res.status(200).json({ success: true, message: "Payment already processed" });
      }

      
      const userId = payment.notes.userId;
      const tokens = parseInt(payment.notes.tokens);

     
      await Payment.create({
        userId,
        amount: payment.amount / 100,
        tokens,
        razorpayId: payment.id,
        razorpayOrderId: payment.order_id,
        
      });

      await User.findByIdAndUpdate(userId, { $inc: { tokenBalance: tokens } });

      console.log(`✅ Webhook: Tokens credited to user ${userId}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false });
  }
};
