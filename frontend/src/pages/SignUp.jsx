import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const signupCustomer = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/customers/signup", formData);

      localStorage.setItem("customerToken", res.data.token);
      localStorage.setItem("customer", JSON.stringify(res.data.customer));

      alert("Sign up successful");

      navigate("/services");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <form
        onSubmit={signupCustomer}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">Customer Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <button className="w-full bg-black text-white py-3 rounded-lg font-semibold">
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 font-semibold">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;