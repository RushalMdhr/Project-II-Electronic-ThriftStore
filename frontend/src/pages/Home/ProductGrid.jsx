
import { useAllProductsQuery } from "../../redux/api/productsApiSlice";
import ProductGridCard from "../../pages/Home/ProductGridCard.jsx";
const ProductGrid = () => {
    const {data : products=[],isLoading,isError,refetch} = useAllProductsQuery();
    console.log(products);

  if(!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h2>
        <p className="text-gray-600">Check back later for new thrift finds!</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trending Thrift Finds
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular pre-loved items from our community of
            sellers
          </p>
        </div>
        <button onClick={() => refetch()}>Refresh Products</button>

        <ProductGridCard products={products}/>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors font-medium">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
