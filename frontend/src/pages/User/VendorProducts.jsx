// components/VendorProducts.jsx
const VendorProducts = ({ group }) => {
  const { vendorInfo, items, shipping } = group;

  return (
    <div className="mb-6 bg-slate-50 p-4 rounded-2xl">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center gap-6 bg-slate-50 hover:bg-emerald-50 rounded-2xl p-6 transition"
          >
            {/* Product Image */}
            <img
              src={item.product.images?.[0] || "https://via.placeholder.com/80"}
              alt={item.product.name}
              className="w-24 h-24 rounded-xl object-cover border border-slate-200"
            />

            {/* Product Info */}
            <div className="flex-1">
              {/* Product Name */}
              <h3 className="text-xl font-semibold text-slate-800">
                {item.product.name}
              </h3>
              {/* Category */}
              <p className="text-slate-500">
                {item.product.category?.name || "Uncategorized"}
              </p>
              {/* Uploaded By */}
              <p className="text-sm text-slate-600">
                Uploaded by:{" "}
                <span className="font-medium">
                  {item.product.uploadedBy?.name ||
                    item.product.uploadedBy?.username ||
                    "Unknown Seller"}
                </span>
              </p>
              {/* City Only */}
              {item.product.uploadedBy?.shippingAddress?.city && (
                <p className="text-sm text-slate-500">
                  City: {item.product.uploadedBy.shippingAddress.city}
                </p>
              )}
            </div>

            {/* Price & Quantity */}
            <div className="text-right">
              <p className="text-lg font-bold text-slate-800">
                Rs. {(item.product.price * item.quantity).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold">
          Seller: {vendorInfo.shopName || vendorInfo.username}
        </h4>

        <p className="text-sm text-slate-600 font-semibold">
          Shipping: Rs. {shipping}
        </p>
      </div>
    </div>
  );
};

export default VendorProducts;
