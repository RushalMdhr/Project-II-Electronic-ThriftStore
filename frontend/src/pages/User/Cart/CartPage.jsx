import React, { useCallback, useEffect, useState } from "react";
import {
  useGetCartItemsQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../../../redux/api/cartApiSlice";
import { useUserId } from "../../../components/UserProvider";
import { Link, useNavigate } from "react-router-dom";
// cart
const CartPage = () => {
  const userId = useUserId();
  const navigate = useNavigate();

  const {
    data: cartItemsData = [],
    isLoading,
    isError,
    refetch,
  } = useGetCartItemsQuery(userId, {
    skip: !userId,
  });
  console.log("cartitems like : ", cartItemsData);

  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [cartItems, setCartItems] = useState([]);
  const [selectedCartItems, setSelectedCartItems] = useState([]);

  useEffect(() => {
    setCartItems(cartItemsData);
    refetch();
  }, [cartItemsData]);

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.product.discountedPrice || item.product.price) * item.quantity,
    0
  );

  const handleQuantityChange = async (itemId, action) => {
    try {
      await updateCartItem({ id: itemId, action }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (!confirmed) return;

    try {
      await deleteCartItem(itemId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your entire cart?"
    );
    if (!confirmed) return;

    try {
      for (const item of cartItems) {
        await deleteCartItem(item._id).unwrap();
      }
      refetch();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout with cartItems:", selectedCartItems);
    navigate("/checkout", { state: { selectedCartItems } });
  };

  //unnecessary refetch is happenning
  const toggleCartItem = useCallback((item) => {
    setSelectedCartItems((prev) =>
      prev.some((selected) => selected._id === item._id)
        ? prev.filter((selected) => selected._id !== item._id)
        : [...prev, item]
    );
  }, []);
  console.log("selected items : ", selectedCartItems);

  // Check if item is selected
  const isItemSelected = useCallback(
    (itemId) => {
      return selectedCartItems.some((item) => item._id === itemId);
    },
    [selectedCartItems]
  );

  if (!userId)
    return <p className="p-4 text-center">Please log in to view your cart.</p>;
  if (isLoading) return <p className="p-4 text-center">Loading cart...</p>;
  if (isError) return <p className="p-4 text-center">Error loading cart.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Go Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
        >
          ← Back to Products
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              🧹 Clear Cart
            </button>
          </div>

          {cartItems.map((item) => {
            const price = item.product.discountedPrice || item.product.price;
            const originalPrice = item.product.discountedPrice
              ? item.product.price
              : null;

            return (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4"
              >
                <input
                  type="checkbox"
                  checked={isItemSelected(item._id)}
                  onChange={() => toggleCartItem(item)}
                />
                <Link to={`/overview/${item.product._id}`}>
                  <img
                    src={item.product.images?.[0] || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded hover:scale-105 transition duration-200"
                  />
                </Link>
                <div className="flex-1 ml-4">
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-gray-600">
                    Price: Rs.{" "}
                    <span className="font-bold text-green-600">{price}</span>
                    {originalPrice && (
                      <span className="line-through text-sm text-gray-500 ml-2">
                        Rs. {originalPrice}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() =>
                        handleQuantityChange(item._id, "decrement")
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() =>
                        handleQuantityChange(item._id, "increment")
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="ml-4 text-red-600 hover:underline"
                  onClick={() => handleDelete(item._id)}
                >
                  🗑 Remove
                </button>
              </div>
            );
          })}

          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: Rs. {totalPrice}</h3>
          </div>

          <div className="text-right mt-6">
            <button
              onClick={handleCheckout}
              className="bg-green-500 w-full py-2 text-white rounded hover:bg-green-600 transition"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
