import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const getUserCartKey = () => {
    const customer = JSON.parse(localStorage.getItem("customer"));

    if (!customer?.id) {
      return null;
    }

    return `cart_${customer.id}`;
  };

  const loadCart = () => {
    const cartKey = getUserCartKey();

    if (!cartKey) {
      setCart([]);
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
  };

  useEffect(() => {
    const customerToken = localStorage.getItem("customerToken");
    const customer = localStorage.getItem("customer");

    if (!customerToken || !customer) {
      alert("Please sign in first to view your cart");
      navigate("/signin");
      return;
    }

    loadCart();
  }, [navigate]);

  const updateQuantity = (id, type) => {
    const cartKey = getUserCartKey();

    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          quantity:
            type === "inc"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1)
        };
      }

      return item;
    });

    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const cartKey = getUserCartKey();

    const updatedCart = cart.filter((item) => item._id !== id);

    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    const confirmClear = window.confirm("Are you sure you want to clear cart?");

    if (!confirmClear) return;

    const cartKey = getUserCartKey();

    localStorage.removeItem(cartKey);
    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6">
          <p>Your cart is empty.</p>

          <Link
            to="/services"
            className="inline-block mt-4 bg-black text-white px-5 py-2 rounded-lg"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="flex gap-4">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-28 h-24 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <p className="text-gray-600">Category: {item.category}</p>
                    <p className="font-semibold">Price: ₹{item.price}</p>
                    <p className="font-semibold">
                      Subtotal: ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, "dec")}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="font-bold">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item._id, "inc")}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white shadow p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold">Total: ₹{total}</h3>
              <p className="text-gray-600">
                Continue to booking form to submit your inquiry.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-5 py-3 rounded-lg"
              >
                Clear Cart
              </button>

              <Link
                to="/booking"
                className="bg-black text-white px-6 py-3 rounded-lg"
              >
                Proceed to Booking
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;