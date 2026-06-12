import { useEffect, useState } from "react";
import API from "../api/api";
import ServiceCard from "../components/ServiceCard";

function Services() {
  const adminToken = localStorage.getItem("adminToken");

  const fixedCategories = [
    "Wedding",
    "Birthday",
    "Corporate",
    "Engagement",
    "Baby Shower",
    "Party",
    "Other"
  ];

  const categories = ["All", ...fixedCategories];

  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("All");
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    imageUrl: "",
    customizationOptions: ""
  });

  const pageStyle = darkMode
    ? "bg-gray-950 text-white"
    : "bg-gray-100 text-black";

  const cardStyle = darkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-black";

  const inputStyle = darkMode
    ? "w-full border border-gray-700 bg-gray-800 text-white p-3 rounded"
    : "w-full border p-3 rounded";

  const fetchServices = async () => {
    try {
      const res = await API.get(`/services?category=${category}`);
      setServices(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category]);

  const resetForm = () => {
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

      resetForm();
      fetchServices();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save service");
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

  const deleteService = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/services/${id}`);
      alert("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.log(error);
      alert("Failed to delete service");
    }
  };

  return (
    <div className={`min-h-screen px-6 py-10 ${pageStyle}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center w-full">
            Service Catalog
          </h2>

          {adminToken && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-black text-white border px-4 py-2 rounded-lg whitespace-nowrap"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          )}
        </div>

        {adminToken && (
          <form
            onSubmit={addOrUpdateService}
            className={`${cardStyle} shadow rounded-xl p-6 space-y-4 mb-10 max-w-3xl mx-auto`}
          >
            <h3 className="text-2xl font-bold">
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

            <button className="bg-black text-white px-4 py-3 rounded w-full font-semibold border">
              {editingServiceId ? "Update Service" : "Add Service"}
            </button>

            {editingServiceId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-3 rounded w-full font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg border ${
                category === cat
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">
            No services found in this category.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service) =>
              adminToken ? (
                <div
                  key={service._id}
                  className={`${cardStyle} rounded-xl shadow p-4`}
                >
                  <img
                    src={
                      service.imageUrl ||
                      "https://via.placeholder.com/400x250"
                    }
                    alt={service.name}
                    className="w-full h-52 object-cover rounded-lg"
                  />

                  <h3 className="text-xl font-bold mt-4">{service.name}</h3>
                  <p className="text-gray-500">{service.category}</p>
                  <p className="font-bold mt-2">₹{service.price}</p>
                  <p className="mt-2">{service.description}</p>

                  {service.customizationOptions?.length > 0 && (
                    <ul className="list-disc ml-5 mt-2 text-sm">
                      {service.customizationOptions.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
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
              ) : (
                <ServiceCard key={service._id} service={service} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;