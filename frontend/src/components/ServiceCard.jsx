import { useNavigate } from "react-router-dom";

function ServiceCard({ service }) {
  const navigate = useNavigate();

  const getUserCartKey = () => {
    const customer = JSON.parse(localStorage.getItem("customer"));

    if (!customer?.id) {
      return null;
    }

    return `cart_${customer.id}`;
  };

  const addToCart = () => {
    const customerToken = localStorage.getItem("customerToken");
    const customer = JSON.parse(localStorage.getItem("customer"));

    if (!customerToken || !customer) {
      alert("Please sign in first to add services to cart");
      navigate("/signin");
      return;
    }

    const cartKey = getUserCartKey();

    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existing = cart.find((item) => item._id === service._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...service,
        quantity: 1
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    alert("Service added to cart");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <img
        src={service.imageUrl || "https://via.placeholder.com/400x250"}
        alt={service.name}
        className="w-full h-52 object-cover rounded-lg"
      />

      <h3 className="text-xl font-bold mt-4">{service.name}</h3>

      <p className="text-gray-600 mt-2">{service.description}</p>

      <p className="font-semibold mt-2">Category: {service.category}</p>

      <p className="text-lg font-bold mt-2">₹{service.price}</p>

      {service.customizationOptions?.length > 0 && (
        <div className="mt-3">
          <p className="font-semibold">Customization:</p>

          <ul className="list-disc ml-5 text-sm text-gray-600">
            {service.customizationOptions.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={addToCart}
        className="mt-4 bg-black text-white px-4 py-2 rounded-lg w-full"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ServiceCard;