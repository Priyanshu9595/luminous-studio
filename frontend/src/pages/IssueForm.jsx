import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function IssueForm() {
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem("customer"));

  const [formData, setFormData] = useState({
    customerName: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    issueType: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitIssue = async (e) => {
    e.preventDefault();

    const customerToken = localStorage.getItem("customerToken");

    if (!customerToken || !customer) {
      alert("Please sign in first to submit issue");
      navigate("/signin");
      return;
    }

    try {
      await API.post("/issues", formData);

      alert("Issue submitted successfully. Admin has been notified by email.");

      setFormData({
        customerName: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        issueType: "",
        subject: "",
        message: ""
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Issue submission failed");
    }
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Submit Your Issue
      </h2>

      <form
        onSubmit={submitIssue}
        className="bg-white shadow rounded-xl p-6 space-y-4"
      >
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <select
          name="issueType"
          value={formData.issueType}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        >
          <option value="">Select Issue Type</option>
          <option value="Booking Issue">Booking Issue</option>
          <option value="Payment Issue">Payment Issue</option>
          <option value="Service Issue">Service Issue</option>
          <option value="Cart Issue">Cart Issue</option>
          <option value="Account Issue">Account Issue</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="subject"
          placeholder="Issue Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <textarea
          name="message"
          placeholder="Describe your issue"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          className="w-full border p-3 rounded"
        />

        <button className="bg-black text-white px-6 py-3 rounded-lg w-full">
          Submit Issue
        </button>
      </form>
    </div>
  );
}

export default IssueForm;