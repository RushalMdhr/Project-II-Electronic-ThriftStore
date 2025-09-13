import { useParams } from "react-router";
import { useGetProductByIdQuery, useGetProductsQuery, useIncreaseViewCountMutation, useReportProductMutation } from "../../../redux/api/productsApiSlice";
import { useCreateOrderMutation } from "../../../redux/api/orderApiSlice";
import ProductGrid from "./ProductGrid";
import { useEffect } from "react";
import AddToCart from "../../User/Cart/AddToCart";
import { useState } from "react";
import { set } from "mongoose";
import { toast } from "react-toastify";

const ProductOverView = () => {
    const param = useParams();
    const { data: product = [] } = useGetProductByIdQuery(param.productId);
    console.log("product from overview",product)
    const { data: productpage = [], isLoading, isError } = useGetProductsQuery({ productId: param.productId });

    const [view, setview] = useState(false);
    const [reason, setReason] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    // FUNCTIONS _______________
    const [createOrder] = useCreateOrderMutation();
    const [increaseViewCount] = useIncreaseViewCountMutation();
    const [reportProduct] = useReportProductMutation();
    
    if (!view) {
        setview(true);
        increaseViewCount(param.productId);
    }

    useEffect(() => {
        console.log("Product data updated:", product);
    }, [product]);

    const makeOrder = async () => {
        const data = {
            orderItems: [{
                product: param.productId,
                quantity: 1,
            }],
        };
        await createOrder(data);
    }

    const createReport = async () => {
        console.log("reason : ", reason)
        console.log("product id  : ", param.productId)
        const report = await reportProduct({ reason, productId: param.productId }).unwrap();
        console.log(report)
        setShowPopup(false);
        setReason("");
    }

    if (product.error) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-400 mb-4">404</h1>
                <p className="text-gray-400 text-xl">Product not found</p>
            </div>
        </div>
    )
// bg-gray-900
    return (<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
  {/* Report Popup */}
  {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
      <div className="bg-white/90 border border-gray-200 p-8 rounded-3xl shadow-2xl w-96 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-600">Report Product</h2>
          <button
            onClick={() => setShowPopup(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <textarea
          className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-32"
          placeholder="Please describe the issue..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowPopup(false)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={createReport}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition font-medium shadow-lg"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Main Content */}
  <div className="container mx-auto px-6 py-16">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div className="space-y-6">
        <div className="relative bg-white rounded-3xl p-6 border border-gray-200 shadow-lg overflow-hidden group">
          {product.images && product.images.length > 0 && (
            <img
              className="w-full h-[28rem] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
              src={product.images[selectedImage]}
              alt={product.name}
            />
          )}
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? "border-emerald-500 shadow-md shadow-emerald-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-8 lg:sticky lg:top-20 self-start">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900">
            {product.name}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-emerald-600">
              ${product.price}
            </span>
            {product.countInStock > 0 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-sm font-medium">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-600 text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-700 text-base leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Specifications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Specifications
          </h3>
          <div className="grid gap-4 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span>Brand</span>
              <span className="font-semibold">{product.brand}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Condition</span>
              <span className="font-semibold">{product.condition}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Quantity</span>
              <span className="font-semibold">{product.countInStock}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Category</span>
              <span className="font-semibold">{product.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Seller</span>
              <span className="text-emerald-600 font-semibold">
                {product.uploadedBy?.username}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
<div className="space-y-5 mt-8">
  {/* Primary Actions */}
  <div className="flex gap-4">
    <AddToCart
      productId={product._id}
      disabled={!product.countInStock}
      className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 
                 text-emerald-700 border border-emerald-200 rounded-xl 
                 font-medium shadow-md hover:from-emerald-100 hover:to-emerald-200 
                 hover:shadow-lg transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <button
      type="button"
      onClick={makeOrder}
      disabled={!product.countInStock}
      className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 
                 text-white rounded-xl font-semibold shadow-lg 
                 hover:from-emerald-600 hover:to-emerald-700 
                 hover:shadow-xl transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Buy Now
    </button>
  </div>

  {/* Secondary Action */}
  <button
    type="button"
    onClick={() => setShowPopup(true)}
    className="w-full px-8 py-3 bg-white/70 backdrop-blur border border-gray-200 
               text-gray-700 rounded-xl font-medium shadow-sm 
               hover:bg-gray-50 hover:shadow-md 
               transition-all duration-200"
  >
    🚩 Report Product
  </button>
</div>
                </div>  
    </div>

    {/* Related Products */}
    <div className="border-t border-gray-200 pt-20">
      <h2 className="text-3xl font-bold mb-10 text-gray-900">
        Related Products
      </h2>
      <ProductGrid products={productpage.products} />
    </div>
  </div>
</div>

    );
};

export default ProductOverView;