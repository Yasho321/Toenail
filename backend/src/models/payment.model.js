import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User collection
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tokens: {
      type: Number,
      required: true,
    },
    status: { type: String,  },
    receiptNumber: { type: String },
    invoiceDate: { type: Date, default: Date.now },
    razorpayId: {
      type: String,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    method: { type: String }, 
    email: { type: String },
    contact: { type: String },
  },
  {
    timestamps: true, 
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
