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
      toast.error("Login Required !");
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
      className={`w-full px-4 py-2 rounded-lg mt-2 font-medium transition-all duration-200 ${
        disabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow hover:shadow-emerald-500/20"
      }`}
    >
      {disabled ? "Out of Stock" : isLoading ? "Adding…" : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
