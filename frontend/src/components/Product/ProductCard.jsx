import React from "react";
import AddToCart from "../Cart/AddToCart";
import { FiEye, FiEdit, FiTrash2, FiHeart } from "react-icons/fi";
import { useSelector } from "react-redux";
import "../../styles/ProductCard.css";

const ProductCard = ({ product, onDelete, onEdit }) => {
  // ✅ Get the currently logged-in user from your custom slice `rushal`
  const user = useSelector((state) => state.auth?.userInfo);
  const userId = user?._id;

  if (!product) return <div className="loading-product">Loading product...</div>;

  const defaultImage = "https://via.placeholder.com/300x300?text=No+Image";
  const BASE_URL = "http://localhost:5000/uploadimage/";
  const productImage =
    Array.isArray(product.image) && product.image.length > 0
      ? `${BASE_URL}${product.image[0]}`
      : defaultImage;

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="product-card-wrapper">
      <div className="product-card">
        {/* Stock Badge */}
        <div className="product-badge">
          {!isOutOfStock ? (
            <span className="in-stock">In Stock ({product.quantity})</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        {/* Product Image & Quick Actions */}
        <div className="product-image-container">
          <img
            src={productImage}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />

          <div className="quick-actions">
            <button className="quick-action-btn" title="Add to Wishlist">
              <FiHeart />
            </button>
            <button className="quick-action-btn" title="Quick View">
              <FiEye />
            </button>

            {/* Add to Cart (only if in stock & user is logged in) */}
            {!isOutOfStock &&
              (userId ? (
                <AddToCart productId={product._id} userId={userId} />
              ) : (
                <button
                  className="quick-action-btn"
                  onClick={() => alert("Please log in to add to cart")}
                >
                  🛒
                </button>
              ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <div className="product-price">${product.price?.toFixed(2)}</div>
            <div className="product-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < (product.rating || 0) ? "star-filled" : "star-empty"}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="product-actions">
          <button className="action-btn" title="View Details">
            <FiEye />
          </button>
          <button
            className="action-btn"
            title="Edit Product"
            onClick={() => onEdit(product)}
          >
            <FiEdit />
          </button>
          <button
            className="action-btn"
            title="Delete Product"
            onClick={() => onDelete(product._id)}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
