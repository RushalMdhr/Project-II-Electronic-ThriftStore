import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router";
import AddToCart from "../../User/Cart/AddToCart";

const ProductGridCard = ({ products }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <div
          key={product._id}
          className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700 hover:border-emerald-500"
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <Link to={`/overview/${product._id}`}>
              <img
                src={product.images ? product.images[0] : "/temp/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </Link>

            {/* Discount Badge */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              {Math.round(
                ((product.price - product.discountedPrice) / product.price) * 100
              )}
              % OFF
            </div>

            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 p-2 bg-gray-900/70 rounded-full shadow-md hover:bg-emerald-600 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md">
              <Heart className="h-4 w-4 text-gray-300 group-hover:text-white" />
            </button>

            {/* Condition Badge */}
            <div className="absolute bottom-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              {product.condition}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400">by {product.uploadedBy?.username}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-200">
                {product.rating}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-emerald-400">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              </div>
            </div>

            {/* Views */}
            <div className="text-gray-400 text-sm mb-3">
              👁 Views: {product.views?.length}
            </div>

            {/* Add to Cart Button */}
            <AddToCart productId={product._id} disabled={!product.countInStock} />
            {/* <button className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all duration-300 hover:scale-[1.03] shadow-md">
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridCard;
