import { useState } from "react";
import { useLazyGetOrderByIdQuery } from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";

const OrderCheckUp = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);

  orderData && console.log("your order : ",orderData)
  
  // Use lazy query - doesn't run automatically
  const [getOrderById, { isLoading }] = useLazyGetOrderByIdQuery();
  // 691c0e1e7e8ca2ce6df40a41
  const findOrderById = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }
    
    try {
      toast.info("Fetching order...");
      const result = await getOrderById(orderId).unwrap();
      setOrderData(result);
      toast.success("Order found!");
    } catch (error) {
      toast.error("Order not found or error occurred");
      setOrderData(null);
    }
  };

  return (
    <>
      <input
        type="text"
        className="border-2 m-4"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <button 
        onClick={findOrderById}
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Find"}
      </button>
      {/* showing whole json data :   */}
      {orderData && (
        <div>
          <h3>Order Found:</h3>
          <pre>{JSON.stringify(orderData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default OrderCheckUp;