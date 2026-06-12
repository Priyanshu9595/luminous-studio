import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem("customer"));
  const cartKey = customer?.id ? `cart_${customer.id}` : null;
  const cart = cartKey ? JSON.parse(localStorage.getItem(cartKey)) || [] : [];

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const [formData, setFormData] = useState({
    customerName: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    budget: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    const customerToken = localStorage.getItem("customerToken");
    const loggedInCustomer = JSON.parse(localStorage.getItem("customer"));

    if (!customerToken || !loggedInCustomer) {
      alert("Please sign in before booking");
      navigate("/signin");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      navigate("/services");
      return;
    }

    try {
      const selectedServices = cart.map((item) => ({
        serviceId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity)
      }));

      const bookingData = {
        ...formData,
        customerName: loggedInCustomer.name,
        email: loggedInCustomer.email,
        phone: loggedInCustomer.phone,
        budget: Number(formData.budget || 0),
        selectedServices,
        totalAmount
      };

      const orderRes = await API.post("/bookings/create-order", {
        amount: totalAmount
      });

      const { order, key } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Luminous Studio",
        description: "Event Service Booking Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            await API.post("/bookings/verify-payment", {
              bookingData,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            alert(
              `Payment successful. Booking confirmation sent to ${loggedInCustomer.email}`
            );

            localStorage.removeItem(cartKey);

            navigate("/");
          } catch (error) {
            console.log(error);
            alert(
              error.response?.data?.message ||
                "Payment done but booking verification failed"
            );
          }
        },

        prefill: {
          name: loggedInCustomer.name,
          email: loggedInCustomer.email,
          contact: loggedInCustomer.phone
        },

        theme: {
          color: "#000000"
        }
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Payment initiation failed");
    }
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Booking Inquiry Form
      </h2>

      <form
        onSubmit={submitBooking}
        className="bg-white shadow rounded-xl p-6 space-y-4"
      >
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={formData.customerName}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        >
          <option value="">Select Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Birthday">Birthday</option>
          <option value="Corporate">Corporate</option>
          <option value="Engagement">Engagement</option>
          <option value="Baby Shower">Baby Shower</option>
          <option value="Party">Party</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="eventLocation"
          placeholder="Event Location"
          value={formData.eventLocation}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="message"
          placeholder="Custom Requirements"
          value={formData.message}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Selected Services</h3>

          {cart.length === 0 ? (
            <p>No services selected.</p>
          ) : (
            cart.map((item) => (
              <p key={item._id}>
                {item.name} x {item.quantity} = ₹
                {Number(item.price) * Number(item.quantity)}
              </p>
            ))
          )}

          <p className="font-bold mt-2">Total Payable: ₹{totalAmount}</p>
        </div>

        <button className="bg-black text-white px-6 py-3 rounded-lg w-full">
          Pay & Submit Booking
        </button>
      </form>
    </div>
  );
}

export default Booking;