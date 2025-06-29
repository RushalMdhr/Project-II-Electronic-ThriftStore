import { Link } from "react-router-dom";
import heroBg from "../../../../temp/gilang-ramadhan-KKprtFExl7c-unsplash.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="absolute inset-0 bg-gray-900/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-white md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Quality Tech, Second Life, <span className="text-emerald-400">First-Rate Value</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover premium second-hand electronics from verified vendors that won't break the bank
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/products">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg rounded-full font-semibold transition">
              Shop Now
            </button>
          </Link>
          <Link to="/upload">
            <button className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg rounded-full font-semibold bg-transparent transition">
              Join as Vendor
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;