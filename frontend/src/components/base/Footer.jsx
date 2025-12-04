import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 relative">
      {/* Back to Top Button */}
      <div className="absolute -top-5 right-6 flex items-center">
        <button
          onClick={scrollToTop}
          className="flex items-center bg-transparent hover:bg-transparent transition-all"
        >
          {/* Arrow inside circle badge */}
          <div className="bg-emerald-500 hover:bg-emerald-600 p-3 rounded-full shadow-lg flex items-center justify-center -mr-4 z-10 transform transition-transform duration-200 hover:scale-105">
            <ArrowUp className="w-7 h-7 text-white" />
          </div>

          {/* Text badge attached */}
          <span className="bg-white border border-gray-700 hover:bg-gray-400 text-emerald-500 hover:text-white px-5 py-1.5 rounded-full font-medium shadow-md transition-colors duration-200">
            Back to Top
          </span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-emerald-400 mb-4">
              ThriftTech
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted marketplace for premium second-hand electronics.
              Quality tech, second life, first-rate value.
            </p>
            <div className="flex space-x-4">
              <Link
                to="#"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contactus"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 ThriftTech. All rights reserved. | Privacy Policy | Terms of
            Service
          </p>
        </div>
      </div>
    </footer>
  );
}
