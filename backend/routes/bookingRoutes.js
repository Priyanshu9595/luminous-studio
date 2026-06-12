const express = require("express");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Gmail transporter for Render
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000
  });
};

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      message: "Order created successfully",
      order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.log("Create order error:", error);
    res.status(500).json({
      message: "Failed to create payment order",
      error: error.message
    });
  }
});

// Verify payment, save booking, then try email
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      bookingData,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    console.log("Payment verify request received");

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.log("Signature mismatch");
      return res.status(400).json({ message: "Payment verification failed" });
    }

    console.log("Payment signature verified");

    const booking = await Booking.create({
      ...bookingData,
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    console.log("Booking saved successfully:", booking._id);

    // Email should not break booking
    try {
      if (
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        process.env.ADMIN_EMAIL &&
        process.env.EMAIL_USER !== "your_email@gmail.com"
      ) {
        const transporter = createEmailTransporter();

        await transporter.verify();
        console.log("Email transporter verified successfully");

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: "New Paid Booking - Luminous Studio",
          html: `
            <h2>New Paid Booking Received</h2>
            <p><b>Name:</b> ${booking.customerName}</p>
            <p><b>Email:</b> ${booking.email}</p>
            <p><b>Phone:</b> ${booking.phone}</p>
            <p><b>Event Type:</b> ${booking.eventType}</p>
            <p><b>Event Date:</b> ${booking.eventDate}</p>
            <p><b>Location:</b> ${booking.eventLocation}</p>
            <p><b>Budget:</b> ₹${booking.budget || 0}</p>
            <p><b>Total Paid:</b> ₹${booking.totalAmount || 0}</p>
            <p><b>Payment ID:</b> ${booking.razorpayPaymentId}</p>
            <p><b>Message:</b> ${booking.message || "No message"}</p>

            <h3>Selected Services</h3>
            ${
              booking.selectedServices?.length
                ? booking.selectedServices
                    .map(
                      (service) =>
                        `<p>${service.name} x ${service.quantity} = ₹${
                          service.price * service.quantity
                        }</p>`
                    )
                    .join("")
                : "<p>No selected services</p>"
            }
          `
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: booking.email,
          subject: "Booking Confirmed - Luminous Studio",
          html: `
            <h2>Thank you for your booking!</h2>
            <p>Hello ${booking.customerName},</p>
            <p>Your payment was successful and your booking inquiry has been submitted.</p>
            <p><b>Total Paid:</b> ₹${booking.totalAmount || 0}</p>
            <p><b>Payment ID:</b> ${booking.razorpayPaymentId}</p>
            <p>Our team will contact you soon.</p>
            <br/>
            <p>Regards,<br/>Luminous Studio</p>
          `
        });

        console.log("Booking emails sent successfully");
      } else {
        console.log("Email skipped: email credentials not configured");
      }
    } catch (emailError) {
      console.log("Email sending failed but booking saved:", emailError.message);
    }

    res.status(201).json({
      message: "Payment verified and booking saved successfully",
      booking
    });
  } catch (error) {
    console.log("Verify payment error:", error);
    res.status(500).json({
      message: "Payment verification or booking failed",
      error: error.message
    });
  }
});

// Admin gets all bookings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin updates booking status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;