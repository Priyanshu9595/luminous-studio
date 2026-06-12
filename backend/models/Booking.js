const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      required: true
    },
    eventDate: {
      type: String,
      required: true
    },
    eventLocation: {
      type: String,
      required: true
    },
    budget: {
      type: Number
    },
    message: {
      type: String
    },
    selectedServices: [
      {
        serviceId: String,
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: {
      type: Number
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Confirmed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);