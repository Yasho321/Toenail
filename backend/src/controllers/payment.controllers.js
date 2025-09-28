import { razorpayInstance } from "../libs/razorpay.js";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import {   getAuth } from '@clerk/express'
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import PDFDocument from "pdfkit";

export const createOrder = async (req, res) => {
  try {
    const { planName } = req.body;
     const { userId } = getAuth(req, { acceptsToken: 'any' })
     const user = await User.findOne({clerkId : userId});
    const plans = {
        standard: { amount: 800, tokens: 10 },
        premium: { amount: 1400, tokens: 25 },
        pro: { amount: 2450, tokens: 50 },
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
    const signature = req.headers["x-razorpay-signature"];
    
    const isValid = await validateWebhookSignature(
      JSON.stringify(req.body),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if(isValid){
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
        invoiceDate: payment.created_at,
        razorpayOrderId: payment.order_id,
        status : payment.status , 
        receiptNumber: `RCP-${Date.now()}`,
        method : payment.method ,
        email : payment.email , 
        contact : payment.contact
      });

      const user2= await User.findByIdAndUpdate(userId, { $inc: { tokenBalance: tokens } });
      
    }

    }


    

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false });
  }
};
export const getAllPayment = async(req , res)=>{
  try {
    const { userId } = getAuth(req, { acceptsToken: 'any' })
    const user = await User.findOne({clerkId : userId});
    if(!user){
      return res.status(400).json({
        success : false , 
        message : "Unauthorized"
      })
    }

    const payments = await Payment.find({userId : user._id}).sort({ createdAt: -1 });
    if(!payments){
      return res.status(400).json({
        success : false , 
        message : "Unable to fetch payments"
      })
    }

    return res.status(200).json({
        success : true ,
        message : "Payments fetched",
        payments
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        success : false , 
        message : "Unable to fetch payments"
    })
    
  }
}

export const downloadReciept = async(req , res)=>{
  try {
    const { userId } = getAuth(req, { acceptsToken: 'any' })
    const user = await User.findOne({clerkId : userId});
    const {id}= req.params; 
    const payment = await Payment.findById(id);

    if (payment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this receipt"
      });
    }
    
    if(!user){
      return res.status(400).json({
        success : false , 
        message : "Unauthorized"
      })
    }
    if(!payment){
      return res.status(400).json({
        success : false , 
        message : "Unable to find payment"
      })
    }

    const doc = new PDFDocument();
    const fileName = `receipt_${payment.receiptNumber || payment._id}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc.fontSize(18).text("Payment Receipt", { align: "center" });
    doc.moveDown();
     doc.fontSize(12).text(`Receipt No: ${payment.receiptNumber}`);
    doc.text(`Date: ${payment.invoiceDate.toLocaleString()}`);
    doc.text(`Payment ID: ${payment.razorpayId}`);
    doc.text(`Order ID: ${payment.razorpayOrderId}`);
    doc.text(`Status: ${payment.status}`);
    doc.text(`Method: ${payment.method}`);
    doc.moveDown();

    doc.text(`Amount Paid: ₹${payment.amount}`);
    doc.text(`Tokens Credited: ${payment.tokens}`);
    doc.moveDown();

    doc.text(`Customer Email: ${payment.email || user.email}`);
    doc.text(`Customer Contact: ${payment.contact || "N/A"}`);
    doc.moveDown();

    doc.text("Seller: Toenail AI ");
    doc.text("Address: Raipur , CG ");
    doc.text("Website: toenail.in");

    doc.end();



  }catch (error) {
    console.log(error)
    return res.status(500).json({
        success : false , 
        message : "Unable to download reciept"
    })
    
  }
}