import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function AdminSignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const signupAdmin = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith("@luminous.co.in")) {
      alert("Admin email must end with @luminous.co.in");
      return;
    }

    try {
      await API.post("/admin/signup", formData);

      alert("Admin signup successful. Please sign in now.");

      navigate("/admin-signin");
    } catch (error) {
      alert(error.response?.data?.message || "Admin signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <form
        onSubmit={signupAdmin}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">Admin Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Admin Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Official Email e.g. manager@luminous.co.in"
          value={formData.email}
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
          Admin Sign Up
        </button>

        <p className="text-center text-sm">
          Already admin?{" "}
          <Link to="/admin-signin" className="text-blue-600 font-semibold">
            Admin Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AdminSignUp;