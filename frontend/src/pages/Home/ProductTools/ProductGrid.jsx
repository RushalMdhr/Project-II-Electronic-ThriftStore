import ProductGridCard from "./ProductGridCard";
import ProductGridCardAdmin from "./ProductGridCardAdmin";

const ProductGrid = ({ products, isAdmin = false }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Products Found
        </h2>
        <p className="text-gray-600">Check back later for new thrift finds!</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGridCard products={products} />
        {/* {isAdmin ? (
          <ProductGridCardAdmin products={products} />
        ) : (
          <ProductGridCard products={products} />
        )} */}
      </div>
    </section>
  );
};

export default ProductGrid;
