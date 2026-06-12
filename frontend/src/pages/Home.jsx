import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-28 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Make Your Event Beautiful
        </h1>

        <p className="mt-5 text-lg md:text-xl max-w-2xl mx-auto">
          We provide wedding, birthday, corporate, and custom event decoration
          services with professional planning and beautiful designs.
        </p>

        <Link
          to="/services"
          className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          Explore Services
        </Link>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow p-6 rounded-xl text-center">
            <h3 className="font-bold text-xl">Custom Decoration</h3>
            <p className="mt-2 text-gray-600">
              Personalized decoration according to your event theme, color, and
              budget.
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl text-center">
            <h3 className="font-bold text-xl">Affordable Packages</h3>
            <p className="mt-2 text-gray-600">
              Choose from multiple event packages based on your budget and
              requirements.
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl text-center">
            <h3 className="font-bold text-xl">Professional Team</h3>
            <p className="mt-2 text-gray-600">
              Experienced event decoration and management team for smooth event
              execution.
            </p>
          </div>
        </div>
      </section>

      {/* Extra Features */}
      <section className="px-6 py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Special Features
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold">24×7 Support</h3>
              <p className="mt-2 text-gray-600">
                Our team is available anytime to help with your event booking
                and queries.
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold">Fast Booking</h3>
              <p className="mt-2 text-gray-600">
                Select services, add to cart, and submit booking inquiry in a
                few clicks.
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold">Verified Services</h3>
              <p className="mt-2 text-gray-600">
                All services are managed by admin to keep pricing and details
                updated.
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold">Custom Packages</h3>
              <p className="mt-2 text-gray-600">
                Customers can request custom decoration, theme, lighting, and
                budget options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Preview */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Events We Manage
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h3 className="font-bold text-xl">Weddings</h3>
            <p className="mt-2 text-gray-600">
              Stage decoration, flower setup, lighting, and entry gate decor.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h3 className="font-bold text-xl">Birthdays</h3>
            <p className="mt-2 text-gray-600">
              Theme decoration, balloon setup, cake table, and photo backdrop.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h3 className="font-bold text-xl">Corporate Events</h3>
            <p className="mt-2 text-gray-600">
              Office parties, product launches, seminar setup, and branding
              decor.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h3 className="font-bold text-xl">Private Parties</h3>
            <p className="mt-2 text-gray-600">
              Engagements, baby showers, anniversary parties, and family events.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 py-10 mt-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold">Luminous Studio</h2>
            <p className="mt-3 text-gray-300">
              Your trusted partner for event decoration, planning, and custom
              celebration services.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/portfolio">Portfolio</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Wedding Decoration</li>
              <li>Birthday Decoration</li>
              <li>Corporate Events</li>
              <li>Custom Theme Setup</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Contact Us</h3>
            <p className="text-gray-300">24×7 Customer Support</p>
            <p className="text-gray-300 mt-2">Email: support@luminous.co.in</p>
            <p className="text-gray-300 mt-2">Phone: +91 9876543210</p>
            <p className="text-gray-300 mt-2">Location: India</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-5 text-center text-gray-400">
          <p>© 2026 Luminous Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;