import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { setRole } from "../../redux/features/auth/authSlice";

const HeroSection = () => {
  const localStorage = useSelector((state) => state.auth);
  const admin = localStorage.userInfo?.isAdmin ? true : false;
  const dispatch = useDispatch();

  // Determine the button text and link
  let vendorButtonText = "";
  let vendorButtonLink = "";
  let showDispatch = false;

  if (!localStorage.userInfo) {
    vendorButtonText = "Become Customer";
    vendorButtonLink = "/register"; // or your customer registration page
  } else if (!localStorage.userInfo.isVendor) {
    vendorButtonText = "Join as Vendor";
    vendorButtonLink = "/vendor/register";
  } else {
    vendorButtonText = "Start Selling";
    vendorButtonLink = "/vendor/upload"; // your seller page
    showDispatch = true;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: admin
            ? "url('/admin-dashboard-bg.jpg')"
            : "url('/hero-cover.jpg')",
          filter: admin ? "brightness(0.6) contrast(1)" : "",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {admin ? "Hello Admin," : "Quality Tech, Second Life,"}
          <span className="text-emerald-400">
            {admin ? "Welcome Back!" : "First-Rate Value"}
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {admin
            ? "Manage users, vendors, products, and insights — all from one place."
            : "Discover premium second-hand electronics from verified vendors that won't break the bank"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to={admin ? "/admin/users" : "/products"}>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg"
            >
              {admin ? "Manage Users" : "Shop Now"}
            </Button>
          </Link>
          <Link to={vendorButtonLink}>
            <Button
              size="lg"
              variant="outline"
              onClick={() => showDispatch && dispatch(setRole("seller"))}
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
            >
              {vendorButtonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
