import { useEffect, useState } from "react";
import { useListcategoryQuery } from "../../redux/api/categoryApiSlice";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useUpdateProductDetailsMutation,
  useDeleteProductMutation,
} from "../../redux/api/productsApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadPageTest = () => {
  const { state } = useLocation();
  const product = state?.product || null;

  const [existingImgs, setExistingImgs] = useState(product?.images || []);
  const [newImgs, setNewImgs] = useState([]);
  const [name, setName] = useState(product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [price, setPrice] = useState(product?.price || "");
  const [condition, setCondition] = useState(product?.condition || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category?._id || "");
  const [quantity, setQuantity] = useState(product?.countInStock || "");
  const [specifications, setSpecifications] = useState(product?.specifications ||{});
  specifications && console.log("spe :",specifications)
  const [tempKey, setTempKey] = useState("");
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    if (!product) {
      setName("");
      setBrand("");
      setPrice("");
      setCondition("");
      setDescription("");
      setCategory("");
      setQuantity("1");
      setExistingImgs([]);
      setNewImgs([]);
    }
  }, [product]);

  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProductDetails] = useUpdateProductDetailsMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const navigate = useNavigate();
  const { data: categories = [] } = useListcategoryQuery();

  const addSpecification = () => {
    if (!tempKey || !tempValue) return;
    setSpecifications((prev) => ({
      ...prev,
      [tempKey]: tempValue,
    }));
    setTempKey("");
    setTempValue("");
  };

  // Remove specification
  const removeSpecification = (key) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !brand ||
      !price ||
      !description ||
      !category ||
      !quantity ||
      !condition
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (price < 0 || quantity < 0) {
      toast.error("Price and Quantity cannot be negative");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("countInStock", quantity);
    formData.append("condition", condition);
    formData.append("specifications", JSON.stringify(specifications)); // 👈 send as JSON string

    let imagePaths = [];
    if (newImgs.length > 0) {
      const imgFormData = new FormData();
      newImgs.forEach((img) => imgFormData.append("images", img));
      try {
        const response = await uploadProductImage(imgFormData).unwrap();
        if (response?.paths) imagePaths = response.paths;
      } catch (err) {
        toast.error("Failed to upload images");
        return;
      }
    }

    imagePaths = [...existingImgs, ...imagePaths];
    formData.append("images", JSON.stringify(imagePaths));

    try {
      if (!product?._id) {
        const createdProduct = await createProduct(formData).unwrap();
        toast.success(`${createdProduct.name} created successfully!`);
        setName("");
        setBrand("");
        setPrice("");
        setCondition("");
        setDescription("");
        setCategory("");
        setQuantity("");
        setExistingImgs([]);
        setNewImgs([]);
        setSpecifications({});
      } else {
        await updateProductDetails({
          productId: product._id,
          data: formData,
        }).unwrap();
        toast.success("Product updated successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Product operation failed");
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const deletedProduct = await deleteProduct(product._id).unwrap();
      toast.success(`${deletedProduct?.name} deleted successfully!`);
      navigate("/vendor/products");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-emerald-400 mb-6 text-center">
        {product ? "Edit Product" : "Upload New Product"}
      </h1>
      <form onSubmit={submitHandler} className="space-y-4">
        {/* Existing images */}
        {existingImgs.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {existingImgs.map((img, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 border border-gray-700 rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt="product"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setExistingImgs(existingImgs.filter((_, i) => i !== idx))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New images preview */}
        <div className="flex gap-2 flex-wrap">
          {newImgs.map((img, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 border border-gray-700 rounded overflow-hidden"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setNewImgs(newImgs.filter((_, i) => i !== idx))}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setNewImgs((prev) => [...prev, ...Array.from(e.target.files)])
          }
          className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
        />

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Price"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value >= 0 ? e.target.value : 0)}
          className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="In Stock Quantity"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value >= 0 ? e.target.value : 0)
          }
          className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat._id}
              className="bg-gray-800 text-gray-100"
            >
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Condition</option>
          <option value="Like new/Open box">Like new/Open box</option>
          <option value="Well-kept">Well-kept</option>
          <option value="Moderately used">Moderately used</option>
          <option value="Functional but worn">Functional but worn</option>
        </select>

        {/* Specifications */}
        <h3 className="mx-2 text-md font-semibold text-emerald-300 mb-2">
          Specifications
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Key (e.g. RAM)"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            className="flex-1 border border-gray-700 rounded px-2 py-1 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Value (e.g. 8GB)"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="flex-1 border border-gray-700 rounded px-2 py-1 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={addSpecification}
            className="bg-emerald-600 px-3 py-1 rounded text-white hover:bg-emerald-700"
          >
            Add
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {Object.entries(specifications).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between bg-gray-800 p-1 px-2 rounded"
            >
              <span>
                <strong>{key}</strong>: {value}
              </span>
              <button
                type="button"
                onClick={() => removeSpecification(key)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {!product ? (
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl transition"
            >
              Upload
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl transition"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadPageTest;
