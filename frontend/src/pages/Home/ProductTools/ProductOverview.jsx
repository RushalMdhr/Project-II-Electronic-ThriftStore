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
    console.log('related products : ',productpage)

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
    return (
        <div className="min-h-screen text-white">
            {/* Report Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/60 z-50">
                    <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl w-96 mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Report Product</h2>
                            <button 
                                onClick={() => setShowPopup(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <textarea
                            className="w-full bg-gray-700 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none h-32"
                            placeholder="Please describe the issue with this product..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createReport}
                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Product Section */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Image Gallery */}
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div className="relative bg-gray-800 rounded-3xl p-8 border border-gray-700 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                                <div className="relative">
                                    {product.images && product.images.length > 0 && (
                                        <img 
                                            className="w-full h-96 object-contain rounded-2xl"
                                            src={product.images[selectedImage]}
                                            alt={product.name}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === index 
                                                    ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                                                    : 'border-gray-600 hover:border-gray-500'
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
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                    <span className="text-blue-400 text-sm font-medium">{product.category?.name}</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white leading-tight">{product.name}</h1>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-green-400">${product.price}</span>
                                    {product.countInStock > 0 ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-4">Product Details</h3>
                                <div className="grid gap-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50 ">
                                        <span className="text-white font-medium">Brand</span>
                                        <span className="text-white font-semibold">{product.brand}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                        <span className="text-white font-medium">Condition</span>
                                        <span className="text-white font-semibold">{product.condition}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                        <span className="text-white font-medium">Quantity Available</span>
                                        <span className="text-white font-semibold">{product.countInStock}</span>

                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                        <span className="text-white font-medium">Category</span>
                                        <span className="text-white font-semibold">{product.category?.name}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-whitefont-medium">Seller</span>
                                        <span className="text-yellow-400 font-semibold">{product.uploadedBy?.username}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <AddToCart 
                                        productId={product._id} 
                                        disabled={!product.countInStock}
                                        className="flex-1"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={makeOrder} 
                                        disabled={!product.countInStock}
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(true)}
                                    className="w-full px-8 py-3 bg-gray-800 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
                                >
                                    Report Product
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    Secure Payment
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                    Fast Shipping
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    </div>
                                    Quality Assured
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="border-t border-gray-800 pt-16">
                        <h2 className="text-3xl font-bold text-white mb-8">Related Products</h2>
                        <ProductGrid products={productpage.products} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductOverView;