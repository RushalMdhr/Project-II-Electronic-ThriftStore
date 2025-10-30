import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category, onClick }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onClick(category._id)}
    >
      <div className="aspect-[4/5] relative">
        <img
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            category.image ? "" : "bg-blue-300"
          } opacity-60 group-hover:opacity-70 transition-opacity`}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
          <p className="text-sm opacity-90 mb-3">{category.used}</p>
          <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>Shop Now</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
