import React from "react";
import {
  useGetCartItemsQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../../redux/api/cartApiSlice";
import { useUserId } from "../../components/UserProvider";

const CartPage = () => {
  const userId = useUserId();

  const { data: cartItems = [], isLoading, isError } = useGetCartItemsQuery(userId, {
    skip: !userId,
  });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  if (!userId) return <p>Please log in to view your cart.</p>;
  if (isLoading) return <p>Loading cart...</p>;
  if (isError) return <p>Error loading cart.</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item flex items-center mb-4">
            <img
              src={item.product.images?.[0] || "/placeholder.png"}
              alt={item.product.name}
              width="100"
            />
            <div className="ml-4">
              <h4>{item.product.name}</h4>
              <p>Price: Rs. {item.product.price}</p>
              <div>
                <button
                  onClick={() =>
                    updateCartItem({ id: item._id, action: "decrement" })
                  }
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartItem({ id: item._id, action: "increment" })
                  }
                >
                  +
                </button>
              </div>
              <button
                onClick={() => deleteCartItem(item._id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
