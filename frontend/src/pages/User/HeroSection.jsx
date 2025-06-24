import { ArrowRight, Sparkles } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Sustainable Fashion</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover Unique
                <span className="text-emerald-600"> Thrifted</span>
                <br />
                Treasures
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Shop pre-loved fashion from trusted sellers worldwide. Find vintage gems, designer pieces, and everyday
                essentials at unbeatable prices.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 font-medium">
                <span>Start Shopping</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors font-medium">
                Become a Seller
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1M+</div>
                <div className="text-sm text-gray-600">Items Sold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Trusted Sellers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Items */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Vintage Jacket"
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">Vintage Denim Jacket</h3>
                  <p className="text-emerald-600 font-bold">$45</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <img
                    src="/placeholder.svg?height=150&width=200"
                    alt="Designer Bag"
                    className="w-full h-36 object-cover rounded-xl mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">Designer Handbag</h3>
                  <p className="text-emerald-600 font-bold">$120</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <img
                    src="/placeholder.svg?height=150&width=200"
                    alt="Retro Sneakers"
                    className="w-full h-36 object-cover rounded-xl mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">Retro Sneakers</h3>
                  <p className="text-emerald-600 font-bold">$65</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Vintage Dress"
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">Vintage Dress</h3>
                  <p className="text-emerald-600 font-bold">$35</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg rotate-12">
              Up to 80% Off!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
