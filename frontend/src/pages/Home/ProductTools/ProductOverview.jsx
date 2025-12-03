import { Link, useNavigate, useParams } from "react-router";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useIncreaseViewCountMutation,
  useReportProductMutation,
} from "../../../redux/api/productsApiSlice";
import { useCreateOrderMutation } from "../../../redux/api/orderApiSlice";
import ProductGrid from "./ProductGrid";
import { useEffect, useState } from "react";
import AddToCart from "../../User/Cart/AddToCart";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Tabs from "../../../components/Product/Tabs";
import ReviewByProduct from "../../../components/ReviewByProduct";

const ProductOverview = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const param = useParams();
  const { data: product = [] } = useGetProductByIdQuery(param.productId);
  const {
    data: productpage = [],
    isLoading,
    isError,
  } = useGetProductsQuery({ productId: param.productId });

  const [view, setView] = useState(false);
  const [reason, setReason] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  // FUNCTIONS
  const [createOrder] = useCreateOrderMutation();
  const [increaseViewCount] = useIncreaseViewCountMutation();
  const [reportProduct] = useReportProductMutation();

  if (!view) {
    setView(true);
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
    try {
      const report = await reportProduct({
        reason,
        productId: param.productId,
      }).unwrap();
      toast.success("Thanks for giving feed back");
      console.log(report);
      setShowPopup(false);
      setReason("");
    } catch (error) {
      toast.error("you have already reported this product");
    }
  };

  if (product.error)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
          <p className="text-gray-700 text-xl">Product not found</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* ===== Report Popup ===== */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white border border-gray-300 p-8 rounded-2xl shadow-lg w-96 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Report Product</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <textarea
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-32"
              placeholder="Please describe the issue with this product..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createReport}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 shadow transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <div className="px-09 py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* ===== Left: Image Gallery ===== */}
          <div className="space-y-6">
            <div className="relative">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full object-contain shadow-lg"
                />
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-blue-500 shadow-md"
                        : "border-gray-300 hover:border-gray-500"
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
            <div className="space-y-5">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-200">
                <span className="text-blue-700 text-sm font-medium">
                  {product.category?.name}
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                {product.name}
              </h1>
              {userInfo && userInfo._id === product.uploadedBy?._id && (
                <div className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-yellow-400 text-black text-sm font-semibold shadow">
                  My Product
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-green-600">
                  Rs.{product.price}
                </span>
                {product.countInStock > 0 ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 border border-green-200 text-green-700">
                    In Stock ({product.countInStock})
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 border border-red-200 text-red-700">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Uploader badge with gradient */}
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-300 shadow-sm bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-200">
                  <span className="text-black text-sm font-medium leading-none">
                    by{" "}
                    <Link to={`/profile/${product.uploadedBy?._id}`}>
                      {product.uploadedBy?.username || "Uploader"}
                    </Link>
                  </span>
                </div>

                {/* Condition badge */}
                <div
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm border
      ${
        product.condition === "Well-kept"
          ? "bg-green-100 border-green-200 text-green-700"
          : product.condition === "Like new/Open box"
          ? "bg-yellow-100 border-yellow-200 text-yellow-700"
          : product.condition === "Functional but worn"
          ? "bg-orange-100 border-orange-200 text-orange-700"
          : product.condition === "Moderately used"
          ? "bg-blue-100 border-blue-200 text-blue-700"
          : "bg-gray-100 border-gray-200 text-gray-700"
      }`}
                >
                  <span className="text-sm font-medium leading-none">
                    {product.condition}
                  </span>
                </div>
              </div>

              {product.description && (
                <p className="text-gray-700 leading-relaxed text-[15px]">
                  {product.description}
                </p>
              )}
            </div>

            {/* ===== Action Buttons ===== */}
            <div className="space-y-4">
              {product.countInStock > 0 &&
                (!userInfo ||
                  (!userInfo.isAdmin &&
                    userInfo._id !== product.uploadedBy?._id?.toString() &&
                    userInfo._id !== product.uploadedBy?.toString())) && (
                  <div className="flex gap-4">
                    {/* Add to Cart Button Wrapper */}
                    <div className="flex-1">
                      <AddToCart
                        productId={product._id}
                        disabled={!product.countInStock}
                        quantity={1}
                      />
                    </div>
                  </div>
                )}
              {product.countInStock > 0 &&
                (!userInfo ||
                  (userInfo._id !== product.uploadedBy?._id?.toString() &&
                    userInfo._id !== product.uploadedBy?.toString())) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!userInfo) {
                        toast.error("Login required");
                        navigate("/login");
                      } else if (userInfo._id === product.uploadedBy._id) {
                        toast.error("Can't report  own product");
                      } else {
                        setShowPopup(true);
                      }
                    }}
                    className="w-full px-8 py-3 bg-white border border-gray-300 text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all"
                  >
                    Report Product
                  </button>
                )}
            </div>
          </div>
        </div>
        <Tabs labels={["Specifications", "Reviews", "Shipping & Returns"]}>
          <div label="Specifications">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {product.specifications &&
                    Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <tr key={key} className="border-b border-gray-200">
                          <th className="py-2 pr-4 font-medium text-gray-700">
                            {key}
                          </th>
                          <td className="py-2" colSpan={3}>
                            {value || "-"}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>

          <div label="Reviews">
            <ReviewByProduct productId={product._id} />
          </div>

          <div label="Shipping & Returns">
            <p>
              Standard shipping: 3-7 business days. Free returns within 30 days.
            </p>
          </div>
        </Tabs>

        {/* ===== Related Products ===== */}
        <div className="border-t border-gray-300 pt-16 mt-16">
          <h2 className="text-3xl font-bold mb-8">Related Products</h2>
          <ProductGrid products={productpage.products} />
        </div>
      </div>
    </div>
  );
};

// clean key-value display
const SpecRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-gray-600 font-medium">{label}</span>
    <span
      className={`font-semibold ${
        highlight ? "text-yellow-600" : "text-gray-800"
      }`}
    >
      {value || "-"}
    </span>
  </div>
);

export default ProductOverview;
