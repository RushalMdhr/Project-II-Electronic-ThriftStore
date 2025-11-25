import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetCartItemsQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../../../redux/api/cartApiSlice";
import { useUserId } from "../../../components/UserProvider";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const CartPage = () => {
  const userId = useUserId();
  const navigate = useNavigate();

  const {
    data: cartItemsData = [],
    isLoading,
    isError,
    refetch,
  } = useGetCartItemsQuery(userId, { skip: !userId });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [cartItems, setCartItems] = useState([]);
  const [Error, setError] = useState(false);
  const [selectedCartItems, setSelectedCartItems] = useState([]);

  useEffect(() => {
    setCartItems(cartItemsData);
    if (cartItemsData.length == 1) {
      setSelectedCartItems(cartItemsData);
     } 
    refetch();
  }, [cartItemsData]);

  const totalPrice = selectedCartItems.reduce(
    (acc, item) =>
      acc +
      (item.product.discountedPrice || item.product.price) * item.quantity,
    0
  );

  const handleQuantityChange = async (itemId, action) => {
    try {
      const item = cartItemsData.find((i) => i._id === itemId);
      if (
        item.product.countInStock < item.quantity + 1 &&
        action === "increment"
      ) {
        toast.warning("Quantity exceeds available stock");
        return;
      }
      await updateCartItem({ id: itemId, action }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Remove this item from your cart?")) return;
    try {
      await deleteCartItem(itemId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear your entire cart?")) return;
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
    navigate("/checkout", { state: { selectedCartItems } });
  };

  const toggleCartItem = useCallback((item) => {
    setSelectedCartItems((prev) =>
      prev.some((s) => s._id === item._id)
        ? prev.filter((s) => s._id !== item._id)
        : [...prev, item]
    );
  }, []);

  const isItemSelected = useCallback(
    (id) => selectedCartItems.some((i) => i._id === id),
    [selectedCartItems]
  );

  const toggleSelectAll = () => {
    if (selectedCartItems.length === cartItems.length) {
      setSelectedCartItems([]); // unselect all
    } else {
      setSelectedCartItems(cartItems); // select all
    }
  };

  if (!userId)
    return (
      <p className="p-4 text-center text-gray-700">
        Please log in to view your cart.
      </p>
    );
  if (isLoading)
    return (
      <p className="p-4 text-center text-gray-700">Loading your cart...</p>
    );
  if (isError)
    return <p className="p-4 text-center text-red-500">Error loading cart.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Top Row: Back Button */}
          <div className="flex justify-start items-center">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-gray-700 font-medium px-3 py-2 rounded-lg 
               bg-white/30 backdrop-blur-sm shadow-sm
               hover:shadow-lg hover:bg-gray-100/50 hover:text-black
               active:scale-95 active:shadow-inner transition-all"
            >
              <ChevronLeft size={20} />
              Continue Shopping
            </button>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              🛒 My Shopping Cart
            </h2>
            <p className="text-gray-500 mt-2 text-lg font-medium opacity-70 transition-opacity duration-300 hover:opacity-90">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          {/* Clear Cart */}
          {cartItems.length > 0 && (
            <div className="flex justify-end mt-2">
              <button
                onClick={handleClearCart}
                className="text-sm px-5 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 shadow-sm transition"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Select All as badge */}
        {cartItems.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor="selectAll"
              className="inline-flex items-center gap-2 px-4 py-1 bg-green-100 text-green-800 rounded-full font-medium cursor-pointer shadow-sm hover:bg-green-200 transition"
            >
              <input
                type="checkbox"
                id="selectAll"
                checked={
                  selectedCartItems.length === cartItems.length &&
                  cartItems.length > 0
                }
                onChange={toggleSelectAll}
                disabled={Error}
                className="w-5 h-8 accent-green-600 cursor-pointer"
              />
              Select All Items
            </label>
          </div>
        )}

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-black transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-5">
              {cartItems.map((item) => {
                const price =
                  item.product.discountedPrice || item.product.price;
                const originalPrice = item.product.discountedPrice
                  ? item.product.price
                  : null;

                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-5 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={isItemSelected(item._id)}
                      onChange={() => toggleCartItem(item)}
                      disabled={item.quantity > item.product.countInStock}
                      className="w-5 h-5 accent-green-600 self-start sm:self-center cursor-pointer"
                    />
                    <Link to={`/overview/${item.product._id}`}>
                      <img
                        src={item.product.images?.[0] || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-28 h-28 object-cover rounded-xl border border-gray-200 hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg text-gray-800 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Price:{" "}
                        <span className="text-gray-900 font-semibold">
                          Rs. {price}
                        </span>
                        {originalPrice && (
                          <span className="line-through text-gray-400 ml-2 text-sm">
                            Rs. {originalPrice}
                          </span>
                        )}
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
                          onClick={() =>
                            handleQuantityChange(item._id, "decrement")
                          }
                        >
                          −
                        </button>
                        <span className="px-4 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
                          onClick={() =>
                            handleQuantityChange(item._id, "increment")
                          }
                        >
                          +
                        </button>
                        <div
                          className={`px-10 font-bold ${
                            item.quantity == item.product.countInStock
                              ? `text-yellow-500`
                              : item.quantity < item.product.countInStock
                              ? `text-green-500`
                              : `text-red-500`
                          }`}
                        >
                          In stock : {item.product.countInStock}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="relative flex items-center justify-center self-start sm:self-center transition group"
                    >
                      {/* Subtle red blur circle on hover */}
                      <span className="absolute w-10 h-10 bg-red-500 rounded-full opacity-0 blur-xl transition-all group-hover:opacity-100 -ml-10.5"></span>

                      {/* Trash icon slightly left by default */}
                      <Trash2
                        size={22}
                        className="relative text-red-500 -ml-10.5" // moves icon slightly left (~6px)
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Checkout Section */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 mt-10 p-5 shadow-md rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Total:{" "}
                <span className="text-gray-900 font-bold">
                  Rs. {totalPrice.toFixed(2)}
                </span>
              </h3>
              <button
                onClick={handleCheckout}
                disabled={selectedCartItems.length === 0}
                className={`${
                  selectedCartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-8 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition w-full sm:w-auto`}
              >
                Proceed to Checkout <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
