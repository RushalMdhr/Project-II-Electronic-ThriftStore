import React from "react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "../../redux/features/cartSlice";

const CartPage = () => {
  const { data: cartItems = [], isLoading, error } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const handleIncrease = (item) => {
    updateCartItem({ cartItemId: item._id, quantity: item.quantity + 1 });
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateCartItem({ cartItemId: item._id, quantity: item.quantity - 1 });
    } else {
      handleRemove(item._id); // Optional: auto-remove when quantity = 1
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await deleteCartItem(cartItemId).unwrap();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  if (isLoading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="cart-item" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <img
              src={item.productId.image}
              alt={item.productId.name}
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <p><strong>{item.productId.name}</strong></p>
              <p>Price: ₹{item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p><strong>Total:</strong> ₹
                  {cartItems.reduce((total, item) => total + item.quantity * item.productId.price, 0)}
              </p>

              <div>
                <button onClick={() => handleDecrease(item)}>-</button>
                <button onClick={() => handleIncrease(item)}>+</button>
                <button onClick={() => handleRemove(item._id)} style={{ color: "red", marginLeft: "10px" }}>Remove</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
