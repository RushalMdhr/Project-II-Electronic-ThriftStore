import React, { useState } from 'react';
import { Star, ShoppingCart, CreditCard, Shield, Truck, Clock, Heart, Share2, ArrowLeft, ArrowRight } from 'lucide-react';

const ProductOverview = () => {
  const [activeTab, setActiveTab] = useState('specifications');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock product data
  const product = {
    name: "Canon EF 24-70mm f/2.8L II USM Lens",
    price: 20000,
    originalPrice: 25000,
    condition: "Refurbished",
    brand: "Canon",
    category: "Camera Lenses",
    inStock: 1,
    rating: 4.8,
    reviews: 127,
    description: "Professional-grade zoom lens with exceptional image quality and build. Features weather sealing, ultrasonic motor for silent focusing, and a constant f/2.8 aperture throughout the zoom range. Perfect for landscape, portrait, and event photography.",
    specifications: {
      name: "Canon EF 24-70mm f/2.8L II USM Lens",
      condition: "Refurbished",
      price: "$20,000",
      inStock: "1",
      brand: "Canon",
      category: "Camera Lenses",
      focalLength: "24-70mm",
      aperture: "f/2.8",
      mount: "Canon EF",
      weight: "805g",
      dimensions: "83.2 x 112.9mm",
      filterDiameter: "82mm",
      minimumFocusDistance: "0.38m",
      maxMagnification: "0.21x"
    },
    images: [
      "https://placehold.co/600x600/1f2937/ffffff?text=Main+View",
      "https://placehold.co/600x600/1f2937/ffffff?text=Side+View",
      "https://placehold.co/600x600/1f2937/ffffff?text=Front+View",
      "https://placehold.co/600x600/1f2937/ffffff?text=Back+View",
      "https://placehold.co/600x600/1f2937/ffffff?text=Detail+View"
    ],
    features: [
      "Professional L-series optical performance",
      "Weather-resistant construction",
      "Ultrasonic motor for fast, quiet autofocus",
      "Constant f/2.8 maximum aperture",
      "Multi-layered coating to reduce flare and ghosting"
    ],
    shippingInfo: {
      estimatedDelivery: "2-3 business days",
      freeShipping: true,
      returnPolicy: "30-day money-back guarantee",
      warranty: "1-year manufacturer warranty"
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>Home</li>
            <li>›</li>
            <li>Cameras & Lenses</li>
            <li>›</li>
            <li className="text-blue-600 font-medium">Camera Lenses</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
              
              {/* Navigation arrows */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-300"
              >
                <ArrowRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index 
                      ? 'border-blue-500 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="ml-2 text-lg font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>
            
            {/* Price Section */}
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-green-600">${product.price.toLocaleString()}</div>
              <div className="text-xl text-gray-500 line-through">${product.originalPrice.toLocaleString()}</div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Save ${Math.round((product.originalPrice - product.price)).toLocaleString()}
              </div>
            </div>
            
            {/* Condition & Stock */}
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.condition}
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                In Stock ({product.inStock})
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
              
              <button className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['specifications', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-medium text-sm transition-colors duration-300 border-b-2 ${
                    activeTab === tab 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'specifications' && 'Specifications'}
                  {tab === 'reviews' && 'Reviews'}
                  {tab === 'shipping' && 'Shipping & Returns'}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-gray-900 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="ml-2 text-lg font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-500">({product.reviews} reviews)</span>
                  </div>
                </div>
                
                {/* Review Summary */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 rounded-lg p-4">
                  {[5, 4, 3, 2, 1].map((starCount) => (
                    <div key={starCount} className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {[...Array(starCount)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[...Array(5 - starCount)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{starCount} Stars</div>
                      <div className="text-lg font-semibold text-gray-900">24</div>
                    </div>
                  ))}
                </div>
                
                {/* Sample Review */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">JD</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        {renderStars(5)}
                        <span className="text-sm text-gray-600">5.0 • 2 days ago</span>
                      </div>
                      <div className="font-medium text-gray-900">Excellent lens for professional work</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    This lens has completely transformed my photography. The image quality is outstanding, 
                    especially in low light conditions. The build quality feels solid and durable. 
                    Worth every penny for serious photographers.
                  </p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <button className="hover:text-blue-600">Helpful (12)</button>
                    <button className="hover:text-blue-600">Report</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Shipping & Returns</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Shipping</h4>
                    </div>
                    <p className="text-gray-700">Estimated delivery: {product.shippingInfo.estimatedDelivery}</p>
                    {product.shippingInfo.freeShipping && (
                      <p className="text-green-600 font-medium mt-2">✓ Free shipping on this item</p>
                    )}
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Returns</h4>
                    </div>
                    <p className="text-gray-700">{product.shippingInfo.returnPolicy}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="w-6 h-6 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Warranty</h4>
                    </div>
                    <p className="text-gray-700">{product.shippingInfo.warranty}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• We ship worldwide with tracking</li>
                    <li>• Orders processed within 24 hours</li>
                    <li>• Delivery times may vary by location</li>
                    <li>• Return window: 30 days from delivery date</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <img 
                    src={`https://placehold.co/300x200/1f2937/ffffff?text=Product+${item}`} 
                    alt={`Related Product ${item}`}
                    className="max-h-full max-w-full object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Related Product {item}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(4.5)}
                    <span className="text-sm text-gray-600">(45)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">$15,000</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;