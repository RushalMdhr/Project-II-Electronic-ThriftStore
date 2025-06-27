import { useState } from "react";
import { useListcategoryQuery } from "../../redux/api/categoryApiSlice";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useUpdateProductDetailsMutation,
  useDeleteProductMutation
} from "../../redux/api/productsApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadPageTest = () => {
  const { state } = useLocation();
  const product = state?.product || null; // Handle case where no product is provided
  console.log("update", product);

  const imgs = product?.images || []; // Use existing images if editing
  console.log("images", imgs);

  const [images, setImages] = useState([]);
  console.log(images);

  // Update file input handler in the form:
  // onChange={(e) => setImages(Array.from(e.target.files))}
  const [name, setName] = useState(product ? product.name : "");
  const [brand, setBrand] = useState(product ? product.brand : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [condition, setCondition] = useState(product ? product.condition : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [category, setCategory] = useState(product ? product.category._id : "");
  const [quantity, setQuantity] = useState(product ? product.quantity : "");

  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProductDetails] = useUpdateProductDetailsMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const navigate = useNavigate();

  const { data: categories = [], isLoading, isError } = useListcategoryQuery();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      // !images ||
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

    // Prepare FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("condition", condition);

    // Upload all images in one request
    let imagePaths = [];
    if (images && images.length > 0) {
      const imgFormData = new FormData();
      images.forEach((img) => imgFormData.append("images", img));
      try {
        const response = await uploadProductImage(imgFormData).unwrap();
        if (response && response.paths) {
          imagePaths = response.paths;
          console.log("Image paths:", imagePaths);
        }
      } catch (err) {
        toast.error("Failed to upload images");
        return;
      }
    }

    // Add image paths as a comma-separated string
    formData.append("images", imagePaths);

    try {
      let createdProduct;
      if (!product || !product._id) {
        createdProduct = await createProduct(formData).unwrap();
        console.log("Created product:", createdProduct);

        if (!createdProduct.ok) {
          toast.error(createdProduct.error);
        }
        toast.success("Product created successfully!");
      } else {
        toast.info("Updating product details...");
        console.log("Updating product with ID:", product._id);
        console.log("Form data being sent:", formData);

        const updatedProduct = await updateProductDetails({
          productId: product._id,
          data : formData,
        }).unwrap();
        toast.info("WORKING");

        console.log("Updated product:", updatedProduct);
      }

      // Optionally reset form or navigate
    } catch (err) {
      console.log("Error creating product:", err);
      toast.error(err.message || "Product operation failed");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;
      
      const deletedProduct = await deleteProduct(product._id).unwrap();
      console.log("Deleted product:", deletedProduct);
      toast.success("Product deleted successfully!");
      navigate("/vendor/products"); // Redirect to products list after deletion
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Delete error:", error);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <form onSubmit={submitHandler} className="space-y-4">
        {/* Show existing product images if editing */}
        {product && product._id && (
          <div className="flex gap-2 mb-2">
            {product.images?.map((image, idx) => (
              <img
                key={`existing-${idx}`}
                src={image}
                alt="product"
                className="w-14 h-14 object-cover rounded border"
              />
            ))}
          </div>
        )}

        {/* Image preview cards for newly selected images */}
        <div className="flex gap-2 mb-2">
          {images.map((img, idx) => (
            <div
              key={img.name + idx}
              className="relative w-14 h-14 border rounded overflow-hidden flex items-center justify-center bg-gray-100"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 bg-white bg-opacity-80 border-none rounded-full w-5 h-5 flex items-center justify-center text-gray-700 font-bold hover:bg-red-100"
                aria-label="Remove image"
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
            setImages((prev) => [...prev, ...Array.from(e.target.files)])
          }
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Condition</option>
          <option value="1">New</option>
          <option value="2">Used</option>
          <option value="3">Refurbished</option>
        </select>
        {!product ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Upload
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
            type="button"
              onClick={handleDeleteProduct}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default UploadPageTest;
