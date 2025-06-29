import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router";

const ProductGridCard = ({ products }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/${product._id}`}><img
                  src={product.images? product.images[0] : "/temp/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                </Link>

                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {Math.round(
                    ((product.price - product.discountedPrice) /
                      product.price) *
                      100
                  )}
                  % OFF
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

                {/* Condition Badge */}
                <div className="absolute bottom-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {product.condition}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">by {product.seller}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {product.rating}
                  </span>
                  {/* <span className="text-sm text-gray-600">
                    ({product.reviews.length})
                  </span> */}
                </div>

                {/* Size */}
                <div className="mb-3">
                  <span className="text-sm text-gray-600">
                    Size: {product.size}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-emerald-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to me</span>
                </button>
              </div>
            </div>
          ))}
        </div>
  )
}

export default ProductGridCard
