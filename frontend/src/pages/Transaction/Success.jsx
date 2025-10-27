import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Remove useNavigate
import { base64Decode } from "esewajs";
import { useEsewaSuccessMutation } from "../../redux/api/transactionApiSlice";
import { toast } from "react-toastify";
import {
  useUpdateOrderToPaidMutation,
} from "../../redux/api/orderApiSlice";

const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const [esewaSuccess] = useEsewaSuccessMutation();
  const [updateOrder] = useUpdateOrderToPaidMutation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  const decoded = base64Decode(token);

  console.log("📍 Debug - Token:", token);
  console.log("📍 Debug - Decoded:", decoded);

  const verifyPaymentAndUpdateStatus = async () => {
    try {
      console.log("📍 Starting verification...");
      
      const response = await esewaSuccess({
        product_id: decoded.transaction_uuid,
      }).unwrap();

      console.log("📍 API Response:", response);

      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Payment verified successfully!");
      toast.loading("updating payment ...");
      toast.error(`transaction id : ${decoded.transaction_uuid}`);
      console.log(`transaction id : ${decoded.transaction_uuid}`);
      const update = await updateOrder({
        orderId: decoded.transaction_uuid,
        data: { method: "esewa" },
      }).unwrap();
      if (update) {
        toast.success("Payment updated successfully!");
        console.log(update);
      }
      toast.dismiss();
    } catch (error) {
      console.error("📍 Error details:", error);
      setIsLoading(false);
      toast.error("Verification failed");
    }
  };

  useEffect(() => {
    verifyPaymentAndUpdateStatus();
  }, []);

  // Simple loading state
  if (isLoading) return <div>🔄 Processing payment...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payment Status Page</h1>
      <p>Check browser console for debug logs</p>
      <button onClick={() => console.log("Manual check")}>Test Console</button>
    </div>
  );
};

export default Success;
