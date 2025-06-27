import { Star, MapPin, ShoppingBag } from "lucide-react"

const FeaturedSeller = () => {
  const sellers = [
    {
      name: "Vintage Vibes Co.",
      location: "Brooklyn, NY",
      rating: 4.9,
      reviews: 1250,
      items: 340,
      avatar: "/placeholder.svg?height=80&width=80",
      specialty: "Vintage & Retro",
      badge: "Top Seller",
    },
    {
      name: "Eco Fashion Hub",
      location: "Portland, OR",
      rating: 4.8,
      reviews: 890,
      items: 220,
      avatar: "/placeholder.svg?height=80&width=80",
      specialty: "Sustainable Fashion",
      badge: "Eco Friendly",
    },
    {
      name: "Designer Finds",
      location: "Los Angeles, CA",
      rating: 4.9,
      reviews: 2100,
      items: 180,
      avatar: "/placeholder.svg?height=80&width=80",
      specialty: "Luxury & Designer",
      badge: "Premium",
    },
    {
      name: "Street Style Store",
      location: "Austin, TX",
      rating: 4.7,
      reviews: 650,
      items: 290,
      avatar: "/placeholder.svg?height=80&width=80",
      specialty: "Streetwear",
      badge: "Trending",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Sellers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Shop from our most trusted and popular sellers with excellent ratings
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            >
              <div className="text-center">
                {/* Badge */}
                <div className="flex justify-center mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {seller.badge}
                  </span>
                </div>

                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={seller.avatar || "/placeholder.svg"}
                    alt={seller.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Seller Info */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {seller.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{seller.specialty}</p>

                <div className="flex items-center justify-center space-x-1 mb-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{seller.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{seller.rating}</span>
                  <span className="text-sm text-gray-600">({seller.reviews} reviews)</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <ShoppingBag className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{seller.items} items</span>
                </div>

                {/* Visit Button */}
                <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium">
                  Visit Shop
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors font-medium">
            View All Sellers
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSeller
