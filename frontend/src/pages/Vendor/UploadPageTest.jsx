import { useState } from "react";
import { useListcategoryQuery } from "../../redux/api/categoryApiSlice";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productsApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadPageTest = () => {
  const [images, setImages] = useState([]);
  console.log(images);
  

  // Update file input handler in the form:
  // onChange={(e) => setImages(Array.from(e.target.files))}
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();

  const navigate = useNavigate();

  const { data: categories = [], isLoading, isError } = useListcategoryQuery();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !images ||
      !name ||
      !brand ||
      !price ||
      !description ||
      !category ||
      !quantity ||
      !condition
    ) {
      alert("Please fill in all fields and select an image.");
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
      const product = await createProduct(formData).unwrap();
      toast.info("WORKING");

      if (!product.ok) {
        toast.error(product.error);
      }
      alert("Product created successfully!");
      // Optionally reset form or navigate
    } catch (err) {
      toast.error(err.data.message || "Failed to create product");
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages((prev) => [...prev, ...Array.from(e.target.files)])}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="">Select Condition</option>
          <option value="1">New</option>
          <option value="2">Used</option>
          <option value="3">Refurbished</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadPageTest;
