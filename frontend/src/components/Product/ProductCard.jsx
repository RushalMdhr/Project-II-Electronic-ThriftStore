import React from "react";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";
import "../../styles/ProductCard.css";

const ProductCard = ({ product, onDelete, onEdit }) => {
  if (!product)
    return <div className="loading-product">Loading product...</div>;

  // Default product image
  const defaultImage = "https://product.img";
  const productImage = product.image || defaultImage;

  // Determine stock status - check both inStock flag and quantity
  const isOutOfStock = product.quantity <= 0 ;

  return (
    <div className="product-card-wrapper">
      <div className="product-card">
        <div className="product-badge">
          {!isOutOfStock ? (
            <span className="in-stock">In Stock ({product.quantity})</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        {/* Rest of your component remains the same */}
        <div className="product-image-container">
          <img
            src={productImage}
            alt={product.name}
            className="product-image"
            onError={(e) => {
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
            <button
              className="quick-action-btn"
              title="Add to Cart"
              disabled={isOutOfStock}
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <div className="product-price">${product.price?.toFixed(2)}</div>
            <div className="product-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < (product.rating || 0) ? "star-filled" : "star-empty"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

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
            onClick={() => onDelete(product.id)}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
