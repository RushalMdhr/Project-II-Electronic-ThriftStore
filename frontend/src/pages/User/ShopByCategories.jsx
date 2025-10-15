import { ArrowRight } from "lucide-react";
import { useGetTopCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const ShopByCategories = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetTopCategoriesQuery();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${encodeURIComponent(categoryId)}`);
  };

  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">Loading categories...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load categories.
      </p>
    );
  }

  const hasMany = categories.length > 4;

  return (
    <section className="py-16 bg-emerald-1000 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing pre-loved items across all your favorite categories
          </p>
        </div>

        {/* If more than 4 categories, show carousel */}
        {hasMany ? (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-10"
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id}>
                <div
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleCategoryClick(category._id)}
                >
                  <div className="aspect-[4/5] relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        category.image ? "" : "bg-blue-300"
                      } opacity-60 group-hover:opacity-70 transition-opacity`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-3">{category.used}</p>
                      <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Shop Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Normal grid if 4 or fewer
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleCategoryClick(category._id)}
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      category.image ? "" : "bg-blue-300"
                    } opacity-60 group-hover:opacity-70 transition-opacity`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{category.used}</p>
                    <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      <span>Shop Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategories;
