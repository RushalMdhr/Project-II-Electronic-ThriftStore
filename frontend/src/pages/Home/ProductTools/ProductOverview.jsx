import { useNavigate, useParams } from "react-router";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useIncreaseViewCountMutation,
  useReportProductMutation,
} from "../../../redux/api/productsApiSlice";
import { useCreateOrderMutation } from "../../../redux/api/orderApiSlice";
import ProductGrid from "./ProductGrid";
import { useEffect } from "react";
import AddToCart from "../../User/Cart/AddToCart";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Tabs from "../../../components/Product/Tabs";

const ProductOverView = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const param = useParams();
  const { data: product = [] } = useGetProductByIdQuery(param.productId);
  console.log("product from overview", product);
  const {
    data: productpage = [],
    isLoading,
    isError,
  } = useGetProductsQuery({ productId: param.productId });
  console.log("related products : ", productpage);

  const [view, setview] = useState(false);
  const [reason, setReason] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

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
      orderItems: [
        {
          product: param.productId,
          quantity: 1,
        },
      ],
    };
    await createOrder(data);
  };

  const createReport = async () => {
    console.log("reason : ", reason);
    console.log("product id  : ", param.productId);
    const report = await reportProduct({
      reason,
      productId: param.productId,
    }).unwrap();
    console.log(report);
    setShowPopup(false);
    setReason("");
  };

  if (product.error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-400 mb-4">404</h1>
          <p className="text-gray-400 text-xl">Product not found</p>
        </div>
      </div>
    );
  // bg-gray-900
  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100">
      {/* ===== Report Popup ===== */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
          <div className="bg-[#1a1d24] border border-gray-700 p-8 rounded-2xl shadow-2xl w-96 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Report Product</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <textarea
              className="w-full bg-[#101317] border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-32"
              placeholder="Please describe the issue with this product..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createReport}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 shadow-lg transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <div className="px-4 py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* ===== Left: Image Gallery ===== */}
          <div className="space-y-6">
            {/* Main Image - clean, no background container */}
            <div className="relative">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[420px] object-contain "
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
                        ? "border-blue-500 shadow-lg shadow-blue-500/30"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== Right: Product Details ===== */}
          <div className="space-y-10">
            {/* Title, Price, and Description */}
            <div className="space-y-5">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-400 text-sm font-medium">
                  {product.category?.name}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-emerald-400">
                  ${product.price}
                </span>
                {product.countInStock > 0 ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    In Stock ({product.countInStock})
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Uploader badge */}
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/70 via-amber-400/70 to-orange-500/70 border border-orange-400/60 backdrop-blur-md shadow-sm">
                  <span className="text-white text-sm font-medium leading-none">
                    by {product.uploadedBy?.username || "Uploader"}
                  </span>
                </div>

                {/* Condition badge */}
                <div
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border
      ${
        product.condition === "Good"
          ? "bg-green-400/10 border-green-400/30 text-green-300"
          : product.condition === "Fair"
          ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-300"
          : product.condition === "Used"
          ? "bg-orange-400/10 border-orange-400/30 text-orange-300"
          : product.condition === "Refurbished"
          ? "bg-blue-400/10 border-blue-400/30 text-blue-300"
          : "bg-gray-500/10 border-gray-500/30 text-gray-400"
      }`}
                >
                  <span className="text-sm font-medium leading-none">
                    {product.condition}
                  </span>
                </div>
              </div>

              {/* Product Description */}
              {product.description && (
                <p className="text-gray-400 leading-relaxed text-[15px]">
                  {product.description}
                </p>
              )}
            </div>

            {/* ===== Action Buttons ===== */}
            <div className="space-y-4">
              {(!userInfo ||
                (!userInfo.isAdmin &&
                  userInfo._id !== product.uploadedBy?._id?.toString() &&
                  userInfo._id !== product.uploadedBy?.toString())) && (
                <div className="flex gap-4">
                  <AddToCart
                    productId={product._id}
                    disabled={!product.countInStock}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    disabled={!product.countInStock}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              )}

              {/* Report Product */}
              <button
                type="button"
                onClick={() => {
                  if (!userInfo) {
                    toast.error("Login required");
                    navigate("/login");
                  } else if (userInfo._id === product.uploadedBy._id) {
                    toast.error("Reporting your own product, brother?");
                  } else {
                    setShowPopup(true);
                  }
                }}
                className="w-full px-8 py-3 bg-[#1a1d24] border border-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-all"
              >
                Report Product
              </button>
            </div>
          </div>
          {/* ===== Specifications ===== */}
          <div className="bg-[#1a1d24]/70 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Product Details
            </h3>
            <div className="divide-y divide-gray-800">
              <SpecRow label="Brand" value={product.brand} />
              <SpecRow label="Condition" value={product.condition} />
              <SpecRow
                label="Quantity Available"
                value={product.countInStock}
              />
              <SpecRow
                label="Category"
                value={product.category?.name || "N/A"}
              />
              <SpecRow
                label="Seller"
                value={product.uploadedBy?.username}
                highlight
              />
            </div>
          </div>
        </div>

        <Tabs product={product} />

        {/* ===== Related Products ===== */}
        <div className="border-t border-gray-800 pt-16 mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Related Products
          </h2>
          <ProductGrid products={productpage.products} />
        </div>
      </div>
    </div>
  );
};

// clean key-value display
const SpecRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-400 font-medium">{label}</span>
    <span
      className={`font-semibold ${
        highlight ? "text-yellow-400" : "text-gray-200"
      }`}
    >
      {value || "-"}
    </span>
  </div>
);

export default ProductOverView;