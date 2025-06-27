import { useParams } from "react-router";
import { useGetProductByIdQuery } from "../../../redux/api/productsApiSlice";
import ProductGrid from "./ProductGrid";
import { useEffect } from "react";

const ProductOverView = () => {
  const param = useParams();
  const { data: product = [] } = useGetProductByIdQuery(param.productId);
  console.log(product);

  useEffect(() => {
    // This will run every time 'product' changes
    console.log("Product data updated:", product);
  }, [product]);

return (
    <>
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col items-center space-y-6 mt-8">
            <img
                className="w-56 h-56 object-cover rounded-lg border-2 border-gray-200 shadow"
                src={product.images ? product.images[0] : "/temp/placeholder.svg"}
                alt={product.name}
            />
            <h1 className="text-3xl font-extrabold text-gray-800">{product.name}</h1>
            <div className="w-full flex flex-col space-y-2 text-gray-700">
                <div className="flex justify-between">
                    <span className="font-semibold">Brand:</span>
                    <span>{product.brand}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Price:</span>
                    <span className="text-green-600 font-bold">${product.price}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Condition:</span>
                    <span>{product.condition}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Quantity:</span>
                    <span>{product.quantity}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Category:</span>
                    <span>{product.category?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Stock:</span>
                    <span>{product.countInStock}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Uploaded By:</span>
                    <span>{product.UploadedBy?.username}</span>
                </div>
            </div>
            <div className="flex space-x-4 mt-4">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                    Add to Cart
                </button>
                <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
                    Buy Now
                </button>
            </div>
        </div>
        <div className="mt-12">
            <ProductGrid />
        </div>
    </>
);
};

export default ProductOverView;
