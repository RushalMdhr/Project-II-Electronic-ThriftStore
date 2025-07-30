const ProductGridCardAdmin = ({ products }) => {
  // Limit to 12 products (4 cols × 3 rows)
  const limitedProducts = products.slice(0, 12);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {limitedProducts.map((product) => (
        <div
          key={product._id}
          className="bg-white shadow-md border rounded-xl p-4 flex flex-row items-center space-x-4 min-h-[120px]"
        >
          <img
            src={product.images?.[0] || "/temp/placeholder.svg"}
            alt={product.name}
            className="w-32 h-20 object-cover rounded-md"
          />

          <div className="flex-1">
            <h3 className="text-md font-bold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Stock:</span> {product.quantity}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Vendor:</span>{" "}
              {product.uploadedBy?.name || "N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridCardAdmin;
