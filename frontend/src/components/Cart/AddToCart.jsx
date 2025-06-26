import React from "react";
import { useAddToCartMutation } from "../../redux/features/cartSlice";

const AddToCart = ({ productId, userId }) => {
  const [addToCart] = useAddToCartMutation();

  const handleClick = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      await addToCart({ userId, productId, quantity: 1 }).unwrap();
      alert("Item added to cart");
    } catch (err) {
      alert("Error adding item to cart");
      console.error("Add to cart error:", err);
    }
  };

  return (
    <button onClick={handleClick} className="quick-action-btn" title="Add to Cart">
      🛒
    </button>
  );
};

export default AddToCart;
