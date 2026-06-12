import { useEffect, useState } from "react";
import API from "../api/api";

function Portfolio() {
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

  const [portfolio, setPortfolio] = useState([]);
  const [category, setCategory] = useState("All");
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
    description: ""
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

  const fetchPortfolio = async () => {
    try {
      const res = await API.get(`/portfolio?category=${category}`);
      setPortfolio(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load portfolio");
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [category]);

  const resetForm = () => {
    setPortfolioForm({
      title: "",
      category: "",
      imageUrl: "",
      description: ""
    });
    setEditingPortfolioId(null);
  };

  const addOrUpdatePortfolio = async (e) => {
    e.preventDefault();

    try {
      if (editingPortfolioId) {
        await API.put(`/portfolio/${editingPortfolioId}`, portfolioForm);
        alert("Portfolio updated successfully");
      } else {
        await API.post("/portfolio", portfolioForm);
        alert("Portfolio added successfully");
      }

      resetForm();
      fetchPortfolio();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save portfolio");
    }
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

  const deletePortfolio = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this portfolio image?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/portfolio/${id}`);
      alert("Portfolio deleted successfully");
      fetchPortfolio();
    } catch (error) {
      console.log(error);
      alert("Failed to delete portfolio");
    }
  };

  return (
    <div className={`min-h-screen px-6 py-10 ${pageStyle}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-center w-full">
            Portfolio Gallery
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
            onSubmit={addOrUpdatePortfolio}
            className={`${cardStyle} shadow rounded-xl p-6 space-y-4 mb-10 max-w-3xl mx-auto`}
          >
            <h3 className="text-2xl font-bold">
              {editingPortfolioId ? "Edit Portfolio" : "Add Portfolio"}
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

            <button className="bg-black text-white px-4 py-3 rounded w-full font-semibold border">
              {editingPortfolioId ? "Update Portfolio" : "Add Portfolio"}
            </button>

            {editingPortfolioId && (
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

        {portfolio.length === 0 ? (
          <p className="text-center text-gray-500">
            No portfolio images found in this category.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div
                key={item._id}
                className={`${cardStyle} rounded-xl shadow overflow-hidden`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="mt-2">{item.description}</p>

                  {adminToken && (
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Portfolio;