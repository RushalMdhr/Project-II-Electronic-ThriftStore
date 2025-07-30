import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function HeroSectionAdmin() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/admin-dashboard-bg.jpg')", // You can change this image to something more dashboard-themed
        }}
      >
        <div className="absolute inset-0 bg-gray-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Hello Admin, <span className="text-blue-400">Welcome Back!</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Manage users, vendors, products, and insights — all from one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/admin/users">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-400 text-white hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
