import { ArrowRight, ArrowLeft } from "lucide-react";
import { useGetTopCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryCard from "../User/CategoryCard";

const ShopByCategories = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetTopCategoriesQuery();

  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    navigate(`/products?category=${id}`);
  };

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load categories
      </p>
    );

  const NextArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} z-20 cursor-pointer text-gray-500 hover:text-gray-900`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ArrowRight className="w-6 h-6" />
    </div>
  );

  const PrevArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} z-20 cursor-pointer text-gray-500 hover:text-gray-900`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ArrowLeft className="w-6 h-6" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: categories.length > 4,
    speed: 500,
    slidesToShow: Math.min(categories.length, 4),
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(categories.length, 4) },
      },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-16 bg-gray-300 text-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing pre-loved items across all your favorite categories
          </p>
        </div>

        <Slider {...settings}>
          {categories.map((category) => (
            <div key={category._id} className="px-2">
              <CategoryCard category={category} onClick={handleCategoryClick} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ShopByCategories;
