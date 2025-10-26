import { useState } from "react";
import LoadingScreen from "../components/ui/Loading";
import { useUpdateOrderToPaidMutation } from "../redux/api/orderApiSlice";
import { toast } from "react-toastify";

const ProductCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateOrderToPaid] = useUpdateOrderToPaidMutation();

  const handleTesting = async () => {
    console.log("okay...");
    toast.loading("paying ...");
    const update = await updateOrderToPaid({
      data: { method: "esewa" },
      orderId: "68fde78cefd743fc84e81d8d",
    }).unwrap();
    toast.dismiss();
    console.log("res",update);
  };
  return (
    <>
      <button
        onClick={() => setIsLoading(!isLoading)}
        className="p-2 bg-red-200 text-red-700 border-2 rounded-2xl m-4"
      >
        Load
      </button>
      <h1>
        {isLoading ? (
          <LoadingScreen setIsLoading={setIsLoading} />
        ) : (
          <>not loading</>
        )}
      </h1>

      <h1>TEST HERE APIS</h1>
      <button
        className="p-2 bg-red-200 text-red-700 border-2 rounded-2xl m-4"
        onClick={handleTesting}
      >
        To Paid
      </button>
    </>
  );
};

export default ProductCard;
