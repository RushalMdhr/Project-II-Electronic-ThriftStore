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

  useEffect(() => {
    if (!product) {
      setName("");
      setBrand("");
      setPrice("");
      setCondition("");
      setDescription("");
      setCategory("");
      setQuantity("");
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
          placeholder="Quantity"
          min="0"
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
          <option value="Brand New">Brand New</option>
          <option value="Like New">Like New</option>
          <option value="Refurbished">Refurbished</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
        </select>

        <div className="space-y-2">
          {!product ? (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Upload
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
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
