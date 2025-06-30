import React from "react";
import AddToCart from "../pages/Cart/AddToCart";
import { useUserId } from "../../components/UserProvider";



const ProductGridCard = ({ products }) => {
   const userId = useUserId();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const isOutOfStock = Number(product.quantity) <= 0;
        const imageUrl = product.images?.[0] || "/temp/placeholder.svg";

        return (
          <div
            key={product._id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">Price: Rs. {product.price}</p>

              
            </div>
            <AddToCart productId={product._id} userId={userId} disabled={isOutOfStock} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGridCard;
