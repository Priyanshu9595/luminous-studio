import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const signinCustomer = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/customers/signin", formData);

      localStorage.setItem("customerToken", res.data.token);
      localStorage.setItem("customer", JSON.stringify(res.data.customer));

      alert("Sign in successful");

      navigate("/services");
    } catch (error) {
      alert(error.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <form
        onSubmit={signinCustomer}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">Customer Sign In</h2>

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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <button className="w-full bg-black text-white py-3 rounded-lg font-semibold">
          Sign In
        </button>

        <p className="text-center text-sm">
          New customer?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;