import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function AdminLogin() {
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

  const signinAdmin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/admin/signin", formData);

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      alert("Admin sign in successful");

      navigate("/admin-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Admin sign in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <form
        onSubmit={signinAdmin}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center">Admin Sign In</h2>

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Admin Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        />

        <button className="w-full bg-black text-white py-3 rounded-lg font-semibold">
          Admin Sign In
        </button>

        <p className="text-center text-sm">
          New admin?{" "}
          <Link to="/admin-signup" className="text-blue-600 font-semibold">
            Create Admin Account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;