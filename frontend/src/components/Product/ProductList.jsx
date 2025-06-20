import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import '../../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");

        // First check if response is OK (status 200-299)
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server responded with ${response.status}: ${
              errorText || "No error message"
            }`
          );
        }

        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(
            `Expected JSON but got: ${text.substring(0, 100)}...`
          );
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    console.log("Attempting to delete product with ID:", productId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 204) {
        console.log(`Product ${productId} deleted successfully`);
        // Update the products state by filtering out the deleted product
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== productId)
        );
      } else {
        // Parse error response and show it
        const errorData = await response.json();
        console.error("Delete failed:", errorData);
        alert(`Delete failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete request error:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  const handleEdit = (product) => {
    // Implement your edit logic here
    console.log("Editing product:", product);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (products.length === 0) return <div>No products found</div>;

  return (
    <div className="products-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={(id) => handleDelete(id)}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default ProductList;
