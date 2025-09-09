import React from "react";
import { useAddToCartMutation } from "../../../redux/api/cartApiSlice";
import { useUserId } from "../../../components/UserProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

// added a buttons

const AddToCart = ({ productId, disabled }) => {
  const userId = useUserId();
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/login")
      return;
    }

    try {
      console.log("🟢 Adding to cart:", { userId, productId });
      await addToCart({ userId, productId, quantity: 1 }).unwrap();
      alert("✅ Product added to cart!");
    } catch (error) {
      console.error("❌ Failed to add to cart:", error);
      alert("❌ Failed to add to cart.");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`px-4 py-2 rounded w-full mt-2 ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
{disabled ? "Out of Stock" : isLoading ? "Adding…" : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
