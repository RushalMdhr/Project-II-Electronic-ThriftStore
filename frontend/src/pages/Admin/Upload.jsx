import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null); // use null for files
  const [quantity, setQuantity] = useState("");

  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("quantity", quantity);

    try {
      let result = await fetch("http://localhost:5000/api/users/upload", {
        method: "POST",
        body: formData,
      });
      result = await result.json();
      console.log(result);
      navigate("/upload");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <h1>Upload</h1>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
