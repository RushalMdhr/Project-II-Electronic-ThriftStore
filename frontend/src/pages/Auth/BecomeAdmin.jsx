import { toast } from "react-toastify";
import { useBecomeAdminMutation } from "../../redux/api/usersApiSlice";
import { useState } from "react";
import LoadingScreen from "../../components/ui/Loading";

const BecomeAdmin = () => {
  const [beAdmin] = useBecomeAdminMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleBecomeAdmin = async () => {
    try {
      setIsLoading(true);
      const res = await beAdmin();
      if (!res) {
        toast.error("Error occurred while processing your request.");
      }
      setIsLoading(false);
      toast.success(`${res.data.message}`);
    } catch (error) {
      console.log(error);
      toast.success(`${res.data.message}`);
    }
  };
  return isLoading ? (
    <LoadingScreen color="emerald" text="Processing to be admin..." />
  ) : (
    <>
      <button onClick={handleBecomeAdmin}>Be admin</button>
    </>
  );
};

export default BecomeAdmin;
