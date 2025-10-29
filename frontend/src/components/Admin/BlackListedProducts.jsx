import { Link } from "react-router";
import {
  useAddToBlackListMutation,
  useGetBlackListedProductsQuery,
} from "../../redux/api/productsApiSlice";
import LoadingScreen from "../ui/Loading";
import { toast } from "react-toastify";

const BlackListedProducts = () => {
  const {
    data: blacklistedProducts,
    isLoading,
    isError,
  } = useGetBlackListedProductsQuery();
  const [addToBlackListSlice, { isLoading: isAdding }] =
    useAddToBlackListMutation();
  blacklistedProducts && console.log("black listed : ", blacklistedProducts);

  const addToBlackList = async (id) => {
    // toast.success(id)
    toast.loading("adding to black list !");
    try {
      console.log("id : ", id);
      const res = await addToBlackListSlice({ productId: id });
      toast.dismiss();
      if (res.error) {
        console.log(res.error?.data?.error);
        toast.error(res.error?.data?.error || "failed");
      } else {
        console.log("res : ", res);
        toast.success("added success");
      }
    } catch (error) {
      console.error("error :", error);
    }
  };
  return (
    <>
      <h1>balck listed here ...</h1>
      {isLoading && <LoadingScreen />}
      {isError && <h2 className="text-red-500">Something went wrong...</h2>}
      {blacklistedProducts?.map((product) => (
        <div key={product._id}>
          <hr />
          <p>
            <Link to={`/overview/${product._id}`}>Name : {product.name}</Link>
          </p>
          <p>Price : {product.price}</p>
          <p>Report Percentage : {product.reportPercentage}</p>
          <p>Report Count : {product.reportsCount}</p>
          <p>Views Count :{product.viewsCount}</p>
          {product.reported?.map((report) => (
            <div key={report._id}>reason : {report.reason}</div>
          ))}
          <button onClick={() => addToBlackList(product._id)}>
            Add to blacklist ?
          </button>
        </div>
      ))}
    </>
  );
};

export default BlackListedProducts;
