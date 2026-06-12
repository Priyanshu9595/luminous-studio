import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [userDropdown, setUserDropdown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);

  const userMenuRef = useRef(null);
  const adminMenuRef = useRef(null);

  const customer = JSON.parse(localStorage.getItem("customer"));
  const adminToken = localStorage.getItem("adminToken");

  const isUserLoggedIn = !!customer;
  const isAdminLoggedIn = !!adminToken;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdown(false);
      }

      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    alert("Logout successful");
    navigate("/");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4">
      <Link to="/" className="text-2xl font-bold">
        Luminous Studio
      </Link>

      <div className="flex flex-wrap gap-5 text-sm md:text-base items-center">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/portfolio">Portfolio</Link>

        {isUserLoggedIn && !isAdminLoggedIn && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/issue">Issue</Link>

            <button
              onClick={logout}
              className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </>
        )}

        {isAdminLoggedIn && (
          <button
            onClick={logout}
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        )}

        {!isUserLoggedIn && !isAdminLoggedIn && (
          <>
            <Link to="/cart">Cart</Link>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setUserDropdown(!userDropdown);
                  setAdminDropdown(false);
                }}
                className="hover:text-yellow-300"
              >
                User ▼
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-3 bg-white text-black rounded-lg shadow-lg w-44 z-50">
                  <Link
                    to="/signup"
                    onClick={() => setUserDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    User Sign Up
                  </Link>

                  <Link
                    to="/signin"
                    onClick={() => setUserDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    User Sign In
                  </Link>
                </div>
              )}
            </div>

            <div className="relative" ref={adminMenuRef}>
              <button
                onClick={() => {
                  setAdminDropdown(!adminDropdown);
                  setUserDropdown(false);
                }}
                className="hover:text-yellow-300"
              >
                Admin ▼
              </button>

              {adminDropdown && (
                <div className="absolute right-0 mt-3 bg-white text-black rounded-lg shadow-lg w-48 z-50">
                  <Link
                    to="/admin-signup"
                    onClick={() => setAdminDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Sign Up
                  </Link>

                  <Link
                    to="/admin-signin"
                    onClick={() => setAdminDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Sign In
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;