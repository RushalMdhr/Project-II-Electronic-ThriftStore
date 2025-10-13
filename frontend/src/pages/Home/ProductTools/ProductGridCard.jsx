import { Heart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AddToCart from "../../User/Cart/AddToCart";
import { useSelector } from "react-redux";

const ProductGridCard = ({ products }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleEdit = (product) => {
    navigate("/vendor/upload", { state: { product } });
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products?.map((product) => {
        const isUploader =
          userInfo &&
          (userInfo._id === product.uploadedBy?._id?.toString() ||
            userInfo._id === product.uploadedBy?.toString());

        return (
          <div
            key={product._id}
            className="group relative rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-t-2xl">
              <Link to={`/overview/${product._id}`}>
                <img
                  src={
                    product.images ? product.images[0] : "/temp/placeholder.svg"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </Link>

              {/* Discount Badge */}
              {product.price > product.discountedPrice && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  {Math.round(
                    ((product.price - product.discountedPrice) /
                      product.price) *
                      100
                  )}
                  % OFF
                </div>
              )}

              {/* Wishlist Button */}
              <button className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full shadow hover:bg-emerald-100 transition-all opacity-0 group-hover:opacity-100">
                <Heart className="h-4 w-4 text-gray-600 group-hover:text-emerald-600" />
              </button>

              {/* Condition Badge */}
              <div className="absolute bottom-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                {product.condition}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col">
              {/* Title & uploader */}
              <div className="mb-2">
                <h3 className="font-semibold text-base text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  by {product.uploadedBy?.username || "Unknown"}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-emerald-600">
                  Rs.{product.price}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs.{product.originalPrice}
                    </span>
                  )}
              </div>

              {/* Rating & Views */}
              <div className="flex justify-between items-center text-sm mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-600">
                    {product.rating || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <i className="ri-eye-line" />
                  {product.views?.length || 0}
                </div>
              </div>

              {/* Add to Cart or Edit */}
              <div className="mt-auto">
                {userInfo?.isAdmin ? // Admin: No button
                null : userInfo &&
                  (userInfo._id === product.uploadedBy?._id?.toString() ||
                    userInfo._id === product.uploadedBy?.toString()) ? (
                  // Uploader: Edit button
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 
      text-white font-medium rounded-lg border border-emerald-600 
      hover:from-emerald-600 hover:to-teal-600 hover:shadow-md 
      hover:shadow-emerald-500/20 transition-all duration-200 text-sm"
                  >
                    Edit My Product
                  </button>
                ) : (
                  // Everyone else (including logged-out): Add to Cart
                  <AddToCart
                    productId={product._id}
                    disabled={!product.countInStock}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGridCard;
