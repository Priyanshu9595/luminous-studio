import { useEffect, useState } from "react";
import API from "../api/api";

function AdminDashboard() {
  const fixedCategories = [
    "Wedding",
    "Birthday",
    "Corporate",
    "Engagement",
    "Baby Shower",
    "Party",
    "Other"
  ];

  const [darkMode, setDarkMode] = useState(false);

  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    imageUrl: "",
    customizationOptions: ""
  });

  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
    description: ""
  });

  const pageBg = darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-black";
  const cardBg = darkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const inputStyle = darkMode
    ? "w-full border border-gray-700 bg-gray-800 text-white p-3 rounded"
    : "w-full border p-3 rounded";

  const fetchData = async () => {
    try {
      const servicesRes = await API.get("/services");
      const portfolioRes = await API.get("/portfolio");
      const bookingsRes = await API.get("/bookings");

      setServices(servicesRes.data);
      setPortfolio(portfolioRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch admin dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      category: "",
      description: "",
      price: "",
      imageUrl: "",
      customizationOptions: ""
    });
    setEditingServiceId(null);
  };

  const resetPortfolioForm = () => {
    setPortfolioForm({
      title: "",
      category: "",
      imageUrl: "",
      description: ""
    });
    setEditingPortfolioId(null);
  };

  const addOrUpdateService = async (e) => {
    e.preventDefault();

    const payload = {
      ...serviceForm,
      price: Number(serviceForm.price),
      customizationOptions: serviceForm.customizationOptions
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")
    };

    try {
      if (editingServiceId) {
        await API.put(`/services/${editingServiceId}`, payload);
        alert("Service updated successfully");
      } else {
        await API.post("/services", payload);
        alert("Service added successfully");
      }

      resetServiceForm();
      fetchData();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save service");
    }
  };

  const addOrUpdatePortfolio = async (e) => {
    e.preventDefault();

    try {
      if (editingPortfolioId) {
        await API.put(`/portfolio/${editingPortfolioId}`, portfolioForm);
        alert("Portfolio updated successfully");
      } else {
        await API.post("/portfolio", portfolioForm);
        alert("Portfolio item added successfully");
      }

      resetPortfolioForm();
      fetchData();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save portfolio image");
    }
  };

  const editService = (service) => {
    setEditingServiceId(service._id);

    setServiceForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      imageUrl: service.imageUrl || "",
      customizationOptions: service.customizationOptions?.join(", ") || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editPortfolio = (item) => {
    setEditingPortfolioId(item._id);

    setPortfolioForm({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      description: item.description || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteService = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/services/${id}`);
      alert("Service deleted successfully");
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Failed to delete service");
    }
  };

  const deletePortfolio = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this portfolio image?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/portfolio/${id}`);
      alert("Portfolio image deleted successfully");
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Failed to delete portfolio image");
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Failed to update booking status");
    }
  };

  return (
    <div className={`min-h-screen px-6 py-10 ${pageBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-black text-white border border-white px-5 py-2 rounded-lg font-semibold"
          >
            {darkMode ? "Simple Look" : "Dark Look"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add/Edit Service Form */}
          <form
            onSubmit={addOrUpdateService}
            className={`${cardBg} shadow rounded-xl p-6 space-y-3`}
          >
            <h3 className="text-xl font-bold">
              {editingServiceId ? "Edit Service" : "Add Service"}
            </h3>

            <input
              placeholder="Service Name"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, name: e.target.value })
              }
              className={inputStyle}
              required
            />

            <select
              value={serviceForm.category}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, category: e.target.value })
              }
              className={inputStyle}
              required
            >
              <option value="">Select Category</option>
              {fixedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              className={inputStyle}
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={serviceForm.price}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, price: e.target.value })
              }
              className={inputStyle}
              required
            />

            <input
              placeholder="Image URL"
              value={serviceForm.imageUrl}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, imageUrl: e.target.value })
              }
              className={inputStyle}
            />

            <input
              placeholder="Customization Options comma separated"
              value={serviceForm.customizationOptions}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  customizationOptions: e.target.value
                })
              }
              className={inputStyle}
            />

            <button className="bg-black text-white px-4 py-3 rounded w-full font-semibold">
              {editingServiceId ? "Update Service" : "Add Service"}
            </button>

            {editingServiceId && (
              <button
                type="button"
                onClick={resetServiceForm}
                className="bg-gray-600 text-white px-4 py-3 rounded w-full font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </form>

          {/* Add/Edit Portfolio Form */}
          <form
            onSubmit={addOrUpdatePortfolio}
            className={`${cardBg} shadow rounded-xl p-6 space-y-3`}
          >
            <h3 className="text-xl font-bold">
              {editingPortfolioId ? "Edit Portfolio Image" : "Add Portfolio Image"}
            </h3>

            <input
              placeholder="Title"
              value={portfolioForm.title}
              onChange={(e) =>
                setPortfolioForm({ ...portfolioForm, title: e.target.value })
              }
              className={inputStyle}
              required
            />

            <select
              value={portfolioForm.category}
              onChange={(e) =>
                setPortfolioForm({
                  ...portfolioForm,
                  category: e.target.value
                })
              }
              className={inputStyle}
              required
            >
              <option value="">Select Category</option>
              {fixedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              placeholder="Image URL"
              value={portfolioForm.imageUrl}
              onChange={(e) =>
                setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })
              }
              className={inputStyle}
              required
            />

            <textarea
              placeholder="Description"
              value={portfolioForm.description}
              onChange={(e) =>
                setPortfolioForm({
                  ...portfolioForm,
                  description: e.target.value
                })
              }
              className={inputStyle}
            />

            <button className="bg-black text-white px-4 py-3 rounded w-full font-semibold">
              {editingPortfolioId ? "Update Portfolio" : "Add Portfolio"}
            </button>

            {editingPortfolioId && (
              <button
                type="button"
                onClick={resetPortfolioForm}
                className="bg-gray-600 text-white px-4 py-3 rounded w-full font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Services List */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-4">All Services</h3>

          {services.length === 0 ? (
            <p>No services added yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {services.map((service) => (
                <div
                  key={service._id}
                  className={`${cardBg} p-4 shadow rounded-xl`}
                >
                  <img
                    src={service.imageUrl || "https://via.placeholder.com/400x250"}
                    alt={service.name}
                    className="h-40 w-full object-cover rounded"
                  />

                  <h4 className="font-bold text-lg mt-3">{service.name}</h4>
                  <p className="text-sm text-gray-500">{service.category}</p>
                  <p className="font-semibold mt-1">₹{service.price}</p>
                  <p className="text-sm mt-2">{service.description}</p>

                  {service.customizationOptions?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-sm">Customizations:</p>
                      <ul className="list-disc ml-5 text-sm">
                        {service.customizationOptions.map((option, index) => (
                          <li key={index}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => editService(service)}
                      className="bg-blue-600 text-white px-3 py-2 rounded w-full"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteService(service._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Portfolio List */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-4">All Portfolio Images</h3>

          {portfolio.length === 0 ? (
            <p>No portfolio images added yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {portfolio.map((item) => (
                <div
                  key={item._id}
                  className={`${cardBg} p-4 shadow rounded-xl`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-40 w-full object-cover rounded"
                  />

                  <h4 className="font-bold text-lg mt-3">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-sm mt-2">{item.description}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => editPortfolio(item)}
                      className="bg-blue-600 text-white px-3 py-2 rounded w-full"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePortfolio(item._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bookings List */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Customer Bookings</h3>

          {bookings.length === 0 ? (
            <p>No customer bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`${cardBg} shadow rounded-xl p-5`}
                >
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-bold text-lg">
                        {booking.customerName}
                      </h4>
                      <p>Email: {booking.email}</p>
                      <p>Phone: {booking.phone}</p>
                      <p>Event Type: {booking.eventType}</p>
                      <p>Event Date: {booking.eventDate}</p>
                      <p>Location: {booking.eventLocation}</p>
                      <p>Budget: ₹{booking.budget || 0}</p>
                      <p>Total Amount: ₹{booking.totalAmount || 0}</p>
                      <p>Message: {booking.message || "No message"}</p>
                    </div>

                    <div>
                      <h5 className="font-bold">Selected Services</h5>

                      {booking.selectedServices?.length > 0 ? (
                        booking.selectedServices.map((service, index) => (
                          <p key={index}>
                            {service.name} x {service.quantity} = ₹
                            {service.price * service.quantity}
                          </p>
                        ))
                      ) : (
                        <p>No selected services</p>
                      )}

                      <select
                        value={booking.status}
                        onChange={(e) =>
                          updateBookingStatus(booking._id, e.target.value)
                        }
                        className={inputStyle}
                      >
                        <option>Pending</option>
                        <option>Contacted</option>
                        <option>Confirmed</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;