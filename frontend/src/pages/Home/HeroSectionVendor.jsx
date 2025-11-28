import { Link } from "react-router-dom" ;
import { Button } from "../../components/ui/button";
import { useDispatch } from "react-redux";
import { setRole } from "../../redux/features/auth/authSlice"
  
export default function HeroSection() {
    const dispatch = useDispatch();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-cover.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Quality Tech, Second Life,{" "}
          <span className="text-emerald-400">First-Rate Value</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Where trusted vendors meet smart buyers — premium second-hand tech at
          unbeatable value.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg"
            >
              Shop Now
            </Button>
          </Link>
          <Link to="/vendor/upload">
            <Button
              size="lg"
              variant="outline"
              onClick={() => dispatch(setRole("seller"))}

              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
            >
              Start Selling
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
