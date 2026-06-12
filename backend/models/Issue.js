const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    issueType: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);