const express = require("express");
const nodemailer = require("nodemailer");
const Issue = require("../models/Issue");
const customerAuthMiddleware = require("../middleware/customerAuthMiddleware");

const router = express.Router();

router.post("/", customerAuthMiddleware, async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      issueType,
      subject,
      message
    } = req.body;

    if (!customerName || !email || !issueType || !subject || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const issue = await Issue.create({
      customerId: req.customer.id,
      customerName,
      email,
      phone,
      issueType,
      subject,
      message
    });

    try {
      if (
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        process.env.ADMIN_EMAIL &&
        process.env.EMAIL_USER !== "your_email@gmail.com"
      ) {
        const transporter = nodemailer.createTransport({
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

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `New Customer Issue - ${issue.issueType}`,
          html: `
            <h2>New Customer Issue Submitted</h2>
            <p><b>Name:</b> ${issue.customerName}</p>
            <p><b>Email:</b> ${issue.email}</p>
            <p><b>Phone:</b> ${issue.phone || "Not provided"}</p>
            <p><b>Issue Type:</b> ${issue.issueType}</p>
            <p><b>Subject:</b> ${issue.subject}</p>
            <p><b>Message:</b></p>
            <p>${issue.message}</p>
            <p><b>Status:</b> ${issue.status}</p>
          `
        });

        console.log("Issue notification email sent successfully");
      } else {
        console.log("Issue email skipped: email credentials not configured");
      }
    } catch (emailError) {
      console.log("Issue email failed but issue saved:", emailError.message);
    }

    res.status(201).json({
      message: "Issue submitted successfully",
      issue
    });
  } catch (error) {
    res.status(500).json({
      message: "Issue submission failed",
      error: error.message
    });
  }
});

module.exports = router;