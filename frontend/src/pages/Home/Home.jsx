import ShopByCategories from "../User/ShopByCategories.jsx";
import { useSelector } from "react-redux";
import ProductGrid from "./ProductTools/ProductGrid.jsx";
import { useGetTopProductQuery } from "../../redux/api/productsApiSlice.js";
import { useEffect } from "react";
import HeroSection from "./HeroSection.jsx";
import { Link } from "react-router-dom";
// import AdminProductGrid from "./Admin/AdminProductGrid"; // If you have one

const Home = () => {
  const { userInfo, role } = useSelector((state) => state.auth); // role: "buyer" or "seller"
  const {
    data: topProducts,
    isLoading,
    isError,
    refetch,
  } = useGetTopProductQuery();

  useEffect(() => {
    refetch();
  }, []);

  const renderHeroSection = () => {
    // if (userInfo) {
    //   if (userInfo.isAdmin) return <HeroSectionAdmin />;
    //   if (userInfo.isVendor) return <HeroSectionVendor />;
    //   if (userInfo.isUser) return <HeroSectionUser />;
    // }
    return <HeroSection />; // Guest
  };

  const isVendorSeller = userInfo?.isVendor && role === "seller";
  const isAdmin = userInfo?.isAdmin;

  return (
    <div>
      {renderHeroSection()}

      {/* Only show categories and user product grid if NOT admin or vendor-as-seller */}
      {!isAdmin && !isVendorSeller && (
        <>
          <ShopByCategories />
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trending Thrift Finds
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular pre-loved items from our community of
              sellers
            </p>
          </div>
          <ProductGrid products={topProducts} />
          <div className="text-center mt-12">
            <Link to="/products">
              <button className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors font-medium">
                View All Products
              </button>
            </Link>
          </div>
        </>
      )}

      {/* Admin-specific product view  */}
     
    </div>
  );
};

export default Home;
