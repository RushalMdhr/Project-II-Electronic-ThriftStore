import { useState } from "react";
import {
  Upload,
  X,
  Plus,
  DollarSign,
  Tag,
  FileText,
  ImageIcon,
} from "lucide-react";

const UploadPage = () => {
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    condition: "",
    size: "",
    brand: "",
  });

  const categories = [
    "Men's Clothing",
    "Women's Clothing",
    "Shoes",
    "Accessories",
    "Bags & Purses",
    "Jewelry",
    "Vintage",
    "Designer",
  ];

  const conditions = ["Like New", "Excellent", "Very Good", "Good", "Fair"];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              file,
              preview: e.target.result,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            List Your Item
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your pre-loved treasures with our community and earn money
            while promoting sustainable fashion
          </p>
        </div>

        <form className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Photos
            </h2>
            <p className="text-gray-600 mb-4">
              Add up to 8 photos. The first photo will be your cover image.
            </p>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop your images here
              </p>
              <p className="text-gray-600 mb-4">or</p>
              <label className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors cursor-pointer">
                <Plus className="h-5 w-5 mr-2" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                        Cover
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Details Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-emerald-600" />
              Item Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Levi's Denim Jacket"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Levi's, Nike, Zara"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., M, 32W, 9.5, One Size"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your item's condition, style, measurements, and any other relevant details..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
              Pricing
            </h2>

            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Set a competitive price. You can always adjust it later.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Tag className="h-5 w-5" />
              <span>List Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
