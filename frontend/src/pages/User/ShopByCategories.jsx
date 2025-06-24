import { ArrowRight } from "lucide-react";

const ShopByCategories = () => {
  const categories = [
    {
      name: "Men's Fashion",
      image: "/placeholder.svg?height=300&width=400",
      itemCount: "2,500+ items",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Women's Fashion",
      image: "/placeholder.svg?height=300&width=400",
      itemCount: "3,200+ items",
      color: "from-pink-500 to-pink-600",
    },
    {
      name: "Vintage Collection",
      image: "/placeholder.svg?height=300&width=400",
      itemCount: "1,800+ items",
      color: "from-amber-500 to-amber-600",
    },
    {
      name: "Accessories",
      image: "/placeholder.svg?height=300&width=400",
      itemCount: "1,200+ items",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing pre-loved items across all your favorite categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-3">
                    {category.itemCount}
                  </p>
                  <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    <span>Shop Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategories;
