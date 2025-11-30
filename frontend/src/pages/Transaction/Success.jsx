import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Remove useNavigate
import { base64Decode } from "esewajs";
import { useEsewaSuccessMutation } from "../../redux/api/transactionApiSlice";
import { toast } from "react-toastify";
import { useUpdateOrderToPaidMutation } from "../../redux/api/orderApiSlice";
import { CheckCircle } from "lucide-react";

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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Processing Payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition">
          <Link to="/">Go to Home</Link>
        </button>
      </div>
    </div>
  );
};

export default Success;
