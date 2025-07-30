import React from "react";

const ProductCard = () => {
  return (
    <div className="max-w-xs mx-auto  rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Sale Badge */}
      <div className="absolute bg-[#1de9b6] text-[#0a1120] text-xs font-bold px-2 py-1 rounded-br-lg z-10">
        38% OFF
      </div>
      
      {/* Product Image Container - Will expand on hover */}
      <div className="relative overflow-hidden group h-48">
        <img
          src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          alt="Samsung Galaxy Tab S7"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-6 text-white">
        {/* Rating */}
        <div className="flex items-center mb-1">
          <span className="text-[#1de9b6] font-medium">Good</span>
        </div>
        
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-white mb-1">
          Samsung Galaxy Tab S7 - 128GB, Wi-Fi
        </h3>

        <div className="flex items-center mb-4 ">
          <span className="text-xl font-bold text-white">$399.99</span>
          <span className="ml-2 text-sm text-gray-300 line-through">$649.99</span>
        </div>

        {/* Store Info */}
        <div className="flex items-center text-sm text-gray-300 mb-3">
          <span>Eco Electronics</span>
          <span className="mx-1">•</span>
          <span className="text-yellow-500">4.6*</span>
        </div>
        
        {/* Price */}
        
        
        {/* Add to Cart Button */}
        <button className="w-full bg-[#1de9b6] hover:bg-[#13c9a7] text-[#0a1120] font-bold py-2 px-4 rounded-md transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;